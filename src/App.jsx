import React, { useState, useEffect, useCallback } from 'react'
import TopBar from './components/TopBar.jsx'
import EmptyState from './components/EmptyState.jsx'
import ScanProgress from './components/ScanProgress.jsx'
import ResultList from './components/ResultList.jsx'
import BottomBar from './components/BottomBar.jsx'
import DeleteModal from './components/DeleteModal.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'
import NavRail from './components/NavRail.jsx'
import { selectedSize, formatSize } from './utils.js'


export default function App() {
  const [appState, setAppState] = useState('idle')
  const [scanResults, setScanResults] = useState([])
  const [scanProgress, setScanProgress] = useState({})
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [enabledCategories, setEnabledCategories] = useState({
    user: true, browsers: true, developer: true, apps: true, advanced: false,
  })
  const [estimates, setEstimates] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteResult, setDeleteResult] = useState(null)
  const [trashSize, setTrashSize] = useState(0)
  const [theme, setTheme] = useState('dark')
  const [updateState, setUpdateState] = useState(null) // 'available' | 'downloaded' | null

  useEffect(() => {
    window.scythe.storeGet('enabledCategories').then(saved => {
      if (saved) setEnabledCategories(saved)
    })
    window.scythe.storeGet('theme').then(saved => {
      if (saved) setTheme(saved)
    })
    runEstimates()

    if (window.scythe.onUpdateAvailable) {
      window.scythe.onUpdateAvailable(() => setUpdateState('available'))
      window.scythe.onUpdateDownloaded(() => setUpdateState('downloaded'))
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.scythe.storeSet('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  function runEstimates() {
    window.scythe.removeAllListeners('estimate:result')
    window.scythe.onEstimateResult(data => {
      setEstimates(prev => ({ ...prev, [data.id]: data.estimatedSize }))
      if (data.id === 'trash') setTrashSize(data.estimatedSize || 0)
    })
    window.scythe.estimateAll()
  }

  const toggleCategory = useCallback(async (categoryKey) => {
    const updated = { ...enabledCategories, [categoryKey]: !enabledCategories[categoryKey] }
    setEnabledCategories(updated)
    await window.scythe.storeSet('enabledCategories', updated)
  }, [enabledCategories])

  const startScan = useCallback(async () => {
    setAppState('scanning')
    setScanProgress({})
    setScanResults([])
    setSelectedIds(new Set())

    const TARGET_CATEGORIES = {
      'user-caches': 'user', 'user-logs': 'user', 'trash': 'user',
      'chrome-cache': 'browsers', 'safari-cache': 'browsers', 'firefox-cache': 'browsers',
      'arc-cache': 'browsers', 'brave-cache': 'browsers',
      'npm-cache': 'developer', 'yarn-cache': 'developer', 'pnpm-store': 'developer',
      'homebrew-cache': 'developer', 'xcode-derived': 'developer',
      'xcode-archives': 'developer', 'ios-simulators': 'developer',
      'slack-cache': 'apps', 'spotify-cache': 'apps', 'zoom-cache': 'apps',
      'vscode-cache': 'apps', 'figma-cache': 'apps', 'docker-data': 'apps',
      'system-caches': 'advanced', 'system-logs': 'advanced', 'temp-system': 'advanced',
    }

    const enabledIds = Object.entries(TARGET_CATEGORIES)
      .filter(([, cat]) => enabledCategories[cat])
      .map(([id]) => id)

    window.scythe.removeAllListeners('scan:progress')
    window.scythe.removeAllListeners('scan:complete')

    window.scythe.onScanProgress(data => {
      setScanProgress(prev => ({ ...prev, [data.id]: data }))
    })

    window.scythe.onScanComplete(results => {
      setScanResults(results)
      const autoSelected = new Set(
        results.filter(r => r.exists && r.safe).map(r => r.id)
      )
      setSelectedIds(autoSelected)
      setAppState('results')
    })

    await window.scythe.startScan(enabledIds)
  }, [enabledCategories])

  const abortScan = useCallback(() => {
    window.scythe.abortScan()
    setAppState('idle')
  }, [])

  const toggleItem = useCallback((id) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleCategory_results = useCallback((category) => {
    const catItems = scanResults.filter(r => r.category === category && r.exists)
    const allSelected = catItems.every(r => selectedIds.has(r.id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (allSelected) {
        catItems.forEach(r => next.delete(r.id))
      } else {
        catItems.forEach(r => next.add(r.id))
      }
      return next
    })
  }, [scanResults, selectedIds])

  const initiateDelete = useCallback(() => {
    if (selectedIds.size === 0) return
    setShowDeleteModal(true)
  }, [selectedIds])

  const confirmDelete = useCallback(async () => {
    setShowDeleteModal(false)
    setAppState('deleting')

    const items = scanResults
      .filter(r => selectedIds.has(r.id))
      .map(r => ({ path: r.path, requiresAdmin: r.requiresAdmin, size: r.size }))

    window.scythe.removeAllListeners('delete:complete')
    window.scythe.onDeleteComplete(summary => {
      setDeleteResult(summary)
      setAppState('done')
    })

    await window.scythe.deleteItems(items)
  }, [scanResults, selectedIds])

  const emptyTrash = useCallback(async () => {
    await window.scythe.emptyTrash()
    setTrashSize(0)
  }, [])

  const resetToIdle = useCallback(() => {
    setAppState('idle')
    setScanResults([])
    setScanProgress({})
    setSelectedIds(new Set())
    setDeleteResult(null)
    runEstimates()
  }, [])

  const totalFoundSize = scanResults.reduce((sum, r) => sum + (r.size || 0), 0)
  const chosenSize = selectedSize(scanResults, selectedIds)
  const scanningItems = Object.values(scanProgress)
  const completedCount = scanningItems.filter(i => i.status === 'done').length
  const totalCount = scanningItems.length

  return (
    <div
      className="flex flex-col"
      style={{ height: '100vh', background: 'var(--app-bg)', color: 'var(--text)', overflow: 'hidden' }}
    >
      <TopBar
        appState={appState}
        onNewScan={appState === 'results' || appState === 'done' ? resetToIdle : undefined}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <UpdateBanner
        updateState={updateState}
        onInstall={() => window.scythe.installUpdate()}
      />

      <div className="flex flex-1 overflow-hidden">
        <NavRail
          appState={appState}
          enabledCategories={enabledCategories}
          scanProgress={scanProgress}
          scanResults={scanResults}
          estimates={estimates}
          totalFoundSize={totalFoundSize}
          chosenSize={chosenSize}
          onStartScan={startScan}
          onAbortScan={abortScan}
          onCategoryClick={(key) => {
            if (appState === 'idle') {
              toggleCategory(key)
            } else if (appState === 'results') {
              document.getElementById('cat-' + key)?.scrollIntoView({ behavior: 'smooth' })
            }
          }}
        />
        <div className="flex flex-1 overflow-hidden">
        {appState === 'idle' && (
          <div className="flex flex-col flex-1 items-center justify-center overflow-y-auto" style={{ padding: '28px 32px' }}>
            <EmptyState />
          </div>
        )}

        {appState === 'scanning' && (
          <div className="flex-1 overflow-y-auto p-8">
            <ScanProgress
              progress={scanProgress}
              completedCount={completedCount}
              totalCount={totalCount}
              onAbort={abortScan}
            />
          </div>
        )}

        {appState === 'results' && (
          <div className="flex-1 overflow-y-auto">
            <ResultList
              results={scanResults}
              selectedIds={selectedIds}
              onToggleItem={toggleItem}
              onToggleCategory={toggleCategory_results}
            />
          </div>
        )}

        {appState === 'deleting' && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center space-y-4">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '2rem',
                  color: 'var(--text)',
                }}
              >
                Raderar...
              </div>
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                Vänta medan filerna raderas permanent
              </p>
            </div>
          </div>
        )}

        {appState === 'done' && deleteResult && (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center space-y-6 max-w-md px-8">
              <div style={{ fontSize: '3rem' }}>✓</div>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500,
                    fontSize: '3rem',
                    lineHeight: 1.1,
                    color: 'var(--accent-green)',
                  }}
                >
                  {formatSize(deleteResult.totalFreed)}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-secondary)',
                    marginTop: '0.25rem',
                    fontSize: '1rem',
                  }}
                >
                  frigjort
                </div>
              </div>
              <div className="space-y-2">
                {deleteResult.results.filter(r => r.success).map(r => (
                  <div
                    key={r.path}
                    className="flex items-center gap-3"
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-body)' }}>✓</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        flex: 1,
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.path}
                    </span>
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                style={{ padding: '11px 32px', borderRadius: '10px', fontSize: '0.9rem' }}
                onClick={resetToIdle}
              >
                Kör ny scanning
              </button>
            </div>
          </div>
        )}
        </div>
      </div>

      {appState === 'results' && (
        <BottomBar
          selectedCount={selectedIds.size}
          selectedSize={chosenSize}
          trashSize={trashSize}
          onHarvest={initiateDelete}
          onEmptyTrash={emptyTrash}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          items={scanResults.filter(r => selectedIds.has(r.id))}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

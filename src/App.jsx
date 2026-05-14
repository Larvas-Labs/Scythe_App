import React, { useState, useEffect, useCallback } from 'react'
import Layout from './components/Layout.jsx'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'
import BottomBar from './components/BottomBar.jsx'
import DeleteModal from './components/DeleteModal.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'
import { selectedSize } from './utils.js'


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
  const [updateState, setUpdateState] = useState(null) // null | 'checking' | 'uptodate' | 'available' | 'downloaded' | 'error'
  const [appVersion, setAppVersion] = useState('')

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
      window.scythe.onUpdateNotAvailable?.(() => setUpdateState('uptodate'))
      window.scythe.onUpdateError?.(() => setUpdateState('error'))
    }
    window.scythe.getVersion?.().then(v => { if (v) setAppVersion(v) })
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

  const checkForUpdates = useCallback(async () => {
    setUpdateState('checking')
    await window.scythe.checkForUpdates?.()
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

  return (
    <Layout
      sidebar={
        <Sidebar
          appState={appState}
          enabledCategories={enabledCategories}
          estimates={estimates}
          scanProgress={scanProgress}
          scanResults={scanResults}
          onCategoryToggle={toggleCategory}
          onCategoryScroll={key => document.getElementById('cat-' + key)?.scrollIntoView({ behavior: 'smooth' })}
          onNewScan={appState === 'results' || appState === 'done' ? resetToIdle : undefined}
          theme={theme}
          onToggleTheme={toggleTheme}
          updateState={updateState}
          appVersion={appVersion}
          onCheckForUpdates={checkForUpdates}
          onInstallUpdate={() => window.scythe.installUpdate()}
        />
      }
      updateBanner={
        <UpdateBanner
          updateState={updateState}
          onInstall={() => window.scythe.installUpdate()}
        />
      }
      bottomBar={appState === 'results' ? (
        <BottomBar
          selectedCount={selectedIds.size}
          selectedSize={chosenSize}
          trashSize={trashSize}
          onHarvest={initiateDelete}
          onEmptyTrash={emptyTrash}
        />
      ) : null}
    >
      <MainContent
        appState={appState}
        scanResults={scanResults}
        scanProgress={scanProgress}
        selectedIds={selectedIds}
        totalFoundSize={totalFoundSize}
        chosenSize={chosenSize}
        deleteResult={deleteResult}
        onStartScan={startScan}
        onToggleItem={toggleItem}
        onToggleCategory={toggleCategory_results}
        onAbortScan={abortScan}
        onNewScan={resetToIdle}
      />

      {showDeleteModal && (
        <DeleteModal
          items={scanResults.filter(r => selectedIds.has(r.id))}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </Layout>
  )
}

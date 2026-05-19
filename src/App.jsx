import React, { useState, useEffect, useCallback, useRef } from 'react'
import Layout from './components/Layout.jsx'
import Sidebar from './components/Sidebar.jsx'
import MainContent from './components/MainContent.jsx'
import BottomBar from './components/BottomBar.jsx'
import DeleteModal from './components/DeleteModal.jsx'
import UpdateBanner from './components/UpdateBanner.jsx'
import { selectedSize } from './utils.js'
import { LangProvider } from './i18n/index.jsx'

const TARGET_CATEGORIES = {
  'user-caches': 'user', 'user-logs': 'user', 'trash': 'user',
  'chrome-cache': 'browsers', 'safari-cache': 'browsers', 'firefox-cache': 'browsers',
  'arc-cache': 'browsers', 'brave-cache': 'browsers',
  'npm-cache': 'developer', 'yarn-cache': 'developer', 'pnpm-store': 'developer',
  'homebrew-cache': 'developer', 'xcode-derived': 'developer',
  'xcode-archives': 'developer', 'ios-simulators': 'developer',
  'slack-cache': 'apps', 'spotify-cache': 'apps', 'zoom-cache': 'apps',
  'vscode-cache': 'apps', 'figma-cache': 'apps', 'docker-data': 'apps',
  'orphaned-scan': 'orphaned',
  'system-caches': 'advanced', 'system-logs': 'advanced', 'temp-system': 'advanced',
}

function AppInner() {
  const [appState, setAppState] = useState('idle')
  const [scanResults, setScanResults] = useState([])
  const [scanProgress, setScanProgress] = useState({})
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [enabledCategories, setEnabledCategories] = useState({
    user: true, browsers: true, developer: true, apps: true, orphaned: true, advanced: false,
  })
  const [estimates, setEstimates] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteResult, setDeleteResult] = useState(null)
  const [deleteProgress, setDeleteProgress] = useState([]) // [{path,name,success,hint?}]
  const [theme, setTheme] = useState('dark')
  const [language, setLanguage] = useState('en')
  const [updateState, setUpdateState] = useState(null) // null | 'checking' | 'uptodate' | 'available' | 'downloading' | 'ready' | 'error'
  const isManualCheckRef = useRef(false)
  const [appVersion, setAppVersion] = useState('')
  const [availableVersion, setAvailableVersion] = useState(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  useEffect(() => {
    window.scythe.storeGet('enabledCategories').then(saved => {
      if (saved) setEnabledCategories(saved)
    })
    window.scythe.storeGet('theme').then(saved => {
      if (saved) setTheme(saved)
    })
    window.scythe.storeGet('language').then(async saved => {
      if (saved) {
        setLanguage(saved)
      } else {
        // Auto-detect from system locale
        const SUPPORTED = ['en', 'sv', 'de', 'fr', 'es']
        try {
          const locale = await window.scythe.getSystemLocale?.()
          if (locale) {
            const code = locale.split('-')[0].toLowerCase()
            if (SUPPORTED.includes(code)) setLanguage(code)
          }
        } catch {}
      }
    })
    runEstimates()

    if (window.scythe.onUpdateAvailable) {
      window.scythe.onUpdateAvailable((info) => {
        setAvailableVersion(info?.version || null)
        setUpdateState('available')
        setBannerDismissed(false)
      })
      window.scythe.onUpdateNotAvailable?.(() => {
        if (isManualCheckRef.current) {
          setUpdateState('uptodate')
          setTimeout(() => setUpdateState(null), 3000)
        }
        isManualCheckRef.current = false
      })
      window.scythe.onUpdateError?.(() => {
        setUpdateState('error')
        setTimeout(() => setUpdateState(null), 4000)
      })
      window.scythe.onDownloadProgress?.((data) => {
        setDownloadProgress(data.percent)
      })
      window.scythe.onUpdateReady?.(() => {
        setUpdateState('ready')
      })
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
        results.filter(r => r.exists && r.safe && r.size > 0).map(r => r.id)
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

  const deselectItems = useCallback((ids) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      ids.forEach(id => next.delete(id))
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
    setDeleteProgress([])
    setAppState('deleting')

    const items = scanResults
      .filter(r => selectedIds.has(r.id))
      .map(r => ({ path: r.path, requiresAdmin: r.requiresAdmin, size: r.size }))

    // Build path→name map so DoneView can show readable names without prop drilling
    const nameByPath = Object.fromEntries(
      scanResults.map(r => [r.path, r.name])
    )
    const augmentResults = (summary) => ({
      ...summary,
      results: (summary.results || []).map(r => ({
        ...r,
        name: nameByPath[r.path] || r.path.split('/').pop() || r.path,
      })),
    })

    window.scythe.removeAllListeners('delete:progress')
    window.scythe.onDeleteProgress(item => {
      const name = nameByPath[item.path] || item.path.split('/').pop() || item.path
      setDeleteProgress(prev => [...prev, { ...item, name }])
    })

    window.scythe.removeAllListeners('delete:complete')
    window.scythe.onDeleteComplete(summary => {
      window.scythe.removeAllListeners('delete:progress')
      setDeleteResult(augmentResults(summary))
      setAppState('done')
    })

    try {
      await window.scythe.deleteItems(items)
    } catch (err) {
      console.error('[confirmDelete] deleteItems IPC failed:', err)
      window.scythe.removeAllListeners('delete:progress')
      setDeleteResult({ results: [], totalFreed: 0 })
      setAppState('done')
    }
  }, [scanResults, selectedIds])

  const checkForUpdates = useCallback(async () => {
    isManualCheckRef.current = true
    setUpdateState('checking')
    await window.scythe.checkForUpdates?.()
  }, [])

  const startDownload = useCallback(() => {
    setUpdateState('downloading')
    setDownloadProgress(0)
    window.scythe.downloadAndInstall?.(availableVersion)
  }, [availableVersion])

  const restartApp = useCallback(() => {
    window.scythe.restartApp?.()
  }, [])

  const quitApp = useCallback(() => {
    window.scythe.quitApp?.()
  }, [])

  const changeLanguage = useCallback(async (code) => {
    setLanguage(code)
    await window.scythe.storeSet('language', code)
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
  const totalEstimate = Object.entries(TARGET_CATEGORIES)
    .filter(([, cat]) => enabledCategories[cat])
    .reduce((sum, [id]) => sum + (estimates[id] || 0), 0)
  const maxEstimate = Object.keys(TARGET_CATEGORIES)
    .reduce((sum, id) => sum + (estimates[id] || 0), 0)

  return (
    <LangProvider initialLang={language}>
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
          availableVersion={availableVersion}
          downloadProgress={downloadProgress}
          appVersion={appVersion}
          onCheckForUpdates={checkForUpdates}
          onDownloadAndInstall={startDownload}
          onRestart={restartApp}
          onQuit={quitApp}
          language={language}
          onChangeLanguage={changeLanguage}
        />
      }
      updateBanner={!bannerDismissed ? (
        <UpdateBanner
          updateState={updateState}
          availableVersion={availableVersion}
          downloadProgress={downloadProgress}
          onDownload={startDownload}
          onDismiss={() => setBannerDismissed(true)}
          onRestart={restartApp}
          onQuit={quitApp}
        />
      ) : null}
      bottomBar={appState === 'results' ? (
        <BottomBar
          selectedCount={selectedIds.size}
          selectedSize={chosenSize}
          onHarvest={initiateDelete}
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
        deleteProgress={deleteProgress}
        totalEstimate={totalEstimate}
        maxEstimate={maxEstimate}
        onStartScan={startScan}
        onToggleItem={toggleItem}
        onToggleCategory={toggleCategory_results}
        onDeselectItems={deselectItems}
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
    </LangProvider>
  )
}

export default function App() {
  return <AppInner />
}

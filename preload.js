const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('scythe', {
  // Scanning
  startScan: (targetIds) => ipcRenderer.invoke('scan:start', targetIds),
  abortScan: () => ipcRenderer.send('scan:abort'),

  // Estimates
  estimateAll: () => ipcRenderer.invoke('estimate:all'),

  // Deletion
  deleteItems: (items) => ipcRenderer.invoke('delete:items', items),
  emptyTrash: () => ipcRenderer.invoke('trash:empty'),

  // Finder
  revealInFinder: (targetPath) => ipcRenderer.invoke('finder:reveal', targetPath),

  // Event listeners
  onScanProgress: (cb) => ipcRenderer.on('scan:progress', (_, data) => cb(data)),
  onScanComplete: (cb) => ipcRenderer.on('scan:complete', (_, data) => cb(data)),
  onEstimateResult: (cb) => ipcRenderer.on('estimate:result', (_, data) => cb(data)),
  onDeleteProgress: (cb) => ipcRenderer.on('delete:progress', (_, data) => cb(data)),
  onDeleteComplete: (cb) => ipcRenderer.on('delete:complete', (_, data) => cb(data)),

  // Listener cleanup
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // Persistent store
  storeGet: (key) => ipcRenderer.invoke('store:get', key),
  storeSet: (key, value) => ipcRenderer.invoke('store:set', key, value),

  // Auto-update
  onUpdateAvailable: (cb) => ipcRenderer.on('update:available', (_, info) => cb(info)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update:downloaded', (_, info) => cb(info)),
  onUpdateNotAvailable: (cb) => ipcRenderer.on('update:notavailable', (_, info) => cb(info)),
  onUpdateError: (cb) => ipcRenderer.on('update:error', (_, msg) => cb(msg)),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  downloadAndInstall: (version) => ipcRenderer.invoke('update:download-and-install', version),
  restartApp: () => ipcRenderer.invoke('update:restart'),
  quitApp: () => ipcRenderer.invoke('update:quit'),
  onDownloadProgress: (cb) => ipcRenderer.on('update:download-progress', (_, data) => cb(data)),
  onUpdateReady: (cb) => ipcRenderer.on('update:ready', () => cb()),

  // Rollback
  getAvailableVersions: () => ipcRenderer.invoke('rollback:get-versions'),
  startRollback: (version) => ipcRenderer.send('rollback:start', { version }),
  onRollbackProgress: (cb) => ipcRenderer.on('rollback:progress', (_, data) => cb(data)),
  onRollbackError: (cb) => ipcRenderer.on('rollback:error', (_, data) => cb(data)),

  // App info
  getVersion: () => ipcRenderer.invoke('app:version'),
  getSystemLocale: () => ipcRenderer.invoke('app:locale'),

  // Tracking
  trackEvent: (eventName, props) => ipcRenderer.send('tracking:track', eventName, props),
  getTrackingEnabled: () => ipcRenderer.invoke('tracking:getEnabled'),
  setTrackingEnabled: (value) => ipcRenderer.invoke('tracking:setEnabled', value),
  getTrackingConsented: () => ipcRenderer.invoke('tracking:getConsented'),
  setTrackingConsented: (value) => ipcRenderer.invoke('tracking:setConsented', value),
})

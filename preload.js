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
  installUpdate: () => ipcRenderer.send('update:install'),

  // App info
  getVersion: () => ipcRenderer.invoke('app:version'),
})

const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { execSync, exec } = require('child_process')
const fs = require('fs')
const os = require('os')
const Store = require('electron-store')

const store = new Store()
const isDev = !app.isPackaged

app.setName('Scythe')

// ─── Auto-updater ─────────────────────────────────────────────────────────────
let autoUpdater
try {
  const updaterModule = require('electron-updater')
  autoUpdater = updaterModule.autoUpdater
  autoUpdater.logger = require('electron-log')
  autoUpdater.logger.transports.file.level = 'info'
  autoUpdater.autoDownload = false
} catch (e) {
  // electron-updater not available (dev/missing config)
}

// ─── Expand ~ in paths ───────────────────────────────────────────────────────
function expandPath(p) {
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2))
  return p
}

// ─── Scan targets ────────────────────────────────────────────────────────────
const SCAN_TARGETS = [
  // USER
  {
    id: 'user-caches',
    name: 'App caches',
    nameKey: 'target.user-caches.name',
    category: 'user',
    path: '~/Library/Caches',
    descKey: 'target.user-caches.desc',
    showChildren: true,
    safe: true,
    requiresAdmin: false,
    icon: '📦',
  },
  {
    id: 'user-logs',
    name: 'User logs',
    nameKey: 'target.user-logs.name',
    category: 'user',
    path: '~/Library/Logs',
    descKey: 'target.user-logs.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '📋',
  },
  {
    id: 'trash',
    name: 'Trash',
    nameKey: 'target.trash.name',
    category: 'user',
    path: '~/.Trash',
    descKey: 'target.trash.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🗑️',
  },
  // BROWSERS
  {
    id: 'chrome-cache',
    name: 'Chrome',
    category: 'browsers',
    path: '~/Library/Caches/Google/Chrome',
    descKey: 'target.chrome-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🌐',
  },
  {
    id: 'safari-cache',
    name: 'Safari',
    category: 'browsers',
    path: '~/Library/Caches/com.apple.Safari',
    descKey: 'target.safari-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🧭',
  },
  {
    id: 'firefox-cache',
    name: 'Firefox',
    category: 'browsers',
    path: '~/Library/Caches/Firefox',
    descKey: 'target.firefox-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🦊',
  },
  {
    id: 'arc-cache',
    name: 'Arc',
    category: 'browsers',
    path: '~/Library/Caches/company.thebrowser.Browser',
    descKey: 'target.arc-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🌈',
  },
  {
    id: 'brave-cache',
    name: 'Brave',
    category: 'browsers',
    path: '~/Library/Application Support/BraveSoftware/Brave-Browser/Default/Cache',
    descKey: 'target.brave-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🦁',
  },
  // DEVELOPER
  {
    id: 'npm-cache',
    name: 'npm cache',
    category: 'developer',
    path: '~/.npm/_cacache',
    descKey: 'target.npm-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '📦',
  },
  {
    id: 'yarn-cache',
    name: 'Yarn cache',
    category: 'developer',
    path: '~/Library/Caches/Yarn',
    descKey: 'target.yarn-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🧶',
  },
  {
    id: 'pnpm-store',
    name: 'pnpm store',
    category: 'developer',
    path: '~/Library/pnpm/store',
    descKey: 'target.pnpm-store.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '⚡',
  },
  {
    id: 'homebrew-cache',
    name: 'Homebrew cache',
    category: 'developer',
    path: '~/Library/Caches/Homebrew',
    descKey: 'target.homebrew-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🍺',
  },
  {
    id: 'xcode-derived',
    name: 'Xcode DerivedData',
    category: 'developer',
    path: '~/Library/Developer/Xcode/DerivedData',
    descKey: 'target.xcode-derived.desc',
    showChildren: true,
    safe: true,
    requiresAdmin: false,
    icon: '🔨',
  },
  {
    id: 'xcode-archives',
    name: 'Xcode Archives',
    category: 'developer',
    path: '~/Library/Developer/Xcode/Archives',
    descKey: 'target.xcode-archives.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '📁',
  },
  {
    id: 'ios-simulators',
    name: 'iOS Simulators',
    nameKey: 'target.ios-simulators.name',
    category: 'developer',
    path: '~/Library/Developer/CoreSimulator/Devices',
    descKey: 'target.ios-simulators.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '📱',
  },
  // APPS
  {
    id: 'slack-cache',
    name: 'Slack',
    category: 'apps',
    path: '~/Library/Application Support/Slack/Cache',
    descKey: 'target.slack-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '💬',
  },
  {
    id: 'spotify-cache',
    name: 'Spotify',
    category: 'apps',
    path: '~/Library/Application Support/Spotify/PersistentCache',
    descKey: 'target.spotify-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🎵',
  },
  {
    id: 'zoom-cache',
    name: 'Zoom',
    category: 'apps',
    path: '~/Library/Application Support/zoom.us/data',
    descKey: 'target.zoom-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '📹',
  },
  {
    id: 'vscode-cache',
    name: 'VS Code',
    category: 'apps',
    path: '~/Library/Application Support/Code/Cache',
    descKey: 'target.vscode-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '💻',
  },
  {
    id: 'figma-cache',
    name: 'Figma',
    category: 'apps',
    path: '~/Library/Application Support/Figma',
    descKey: 'target.figma-cache.desc',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🎨',
  },
  {
    id: 'docker-data',
    name: 'Docker',
    nameKey: 'target.docker-data.name',
    category: 'apps',
    path: '~/Library/Containers/com.docker.docker/Data',
    descKey: 'target.docker-data.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '🐳',
  },
  // ADVANCED
  {
    id: 'system-caches',
    name: 'System caches',
    nameKey: 'target.system-caches.name',
    category: 'advanced',
    path: '/Library/Caches',
    descKey: 'target.system-caches.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: true,
    icon: '⚙️',
  },
  {
    id: 'system-logs',
    name: 'System logs',
    nameKey: 'target.system-logs.name',
    category: 'advanced',
    path: '/var/log',
    descKey: 'target.system-logs.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: true,
    icon: '📄',
  },
  {
    id: 'temp-system',
    name: 'Temp system files',
    nameKey: 'target.temp-system.name',
    category: 'advanced',
    path: '/private/var/folders',
    descKey: 'target.temp-system.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: true,
    icon: '🗂️',
  },
  {
    id: 'orphaned-scan',
    name: 'Orphaned data',
    nameKey: 'target.orphaned.name',
    category: 'orphaned',
    path: null,
    descKey: 'target.orphaned.desc',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '👻',
  },
]

// ─── Helper: Orphaned data detection ─────────────────────────────────────────

const ORPHAN_SCAN_DIRS = [
  '~/Library/Application Support',
  '~/Library/Containers',
  '~/Library/Group Containers',
  '~/Library/HTTPStorages',
  '~/Library/WebKit',
  '~/Library/Application Scripts',
]

function getInstalledBundleIds() {
  const bundleIds = new Set()
  const appNames = new Set()

  // 1. .app bundles in standard app directories
  const appDirs = [
    '/Applications',
    path.join(os.homedir(), 'Applications'),
    '/System/Applications',
  ]
  for (const dir of appDirs) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.name.endsWith('.app')) continue
        appNames.add(entry.name.replace('.app', '').toLowerCase())
        try {
          const bid = execSync(
            `defaults read "${path.join(dir, entry.name, 'Contents', 'Info')}" CFBundleIdentifier 2>/dev/null`,
            { timeout: 2000 }
          ).toString().trim()
          if (bid) bundleIds.add(bid)
        } catch {}
      }
    } catch {}
  }

  // 2. Homebrew Cellar (formulae) and Caskroom (casks) — no brew command needed
  const brewPaths = [
    '/opt/homebrew/Cellar',       // Apple Silicon
    '/opt/homebrew/Caskroom',
    '/usr/local/Cellar',          // Intel
    '/usr/local/Caskroom',
    path.join(os.homedir(), 'homebrew/Cellar'),   // custom prefix
    path.join(os.homedir(), 'homebrew/Caskroom'),
  ]
  for (const brewPath of brewPaths) {
    try {
      for (const entry of fs.readdirSync(brewPath, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        appNames.add(entry.name.toLowerCase())
        bundleIds.add(entry.name)
      }
    } catch {}
  }

  // 3. LaunchAgents/LaunchDaemons — plist filenames reveal active software IDs
  const launchDirs = [
    path.join(os.homedir(), 'Library/LaunchAgents'),
    '/Library/LaunchAgents',
    '/Library/LaunchDaemons',
  ]
  for (const dir of launchDirs) {
    try {
      for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith('.plist')) continue
        bundleIds.add(file.replace('.plist', ''))
      }
    } catch {}
  }

  return { bundleIds, appNames }
}

function getOrphanedFolders() {
  const { bundleIds, appNames } = getInstalledBundleIds()
  const seen = new Set()
  const orphaned = []

  for (const dir of ORPHAN_SCAN_DIRS) {
    const resolved = expandPath(dir)
    try {
      for (const entry of fs.readdirSync(resolved, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue
        const name = entry.name
        if (name.startsWith('.')) continue
        if (name.startsWith('com.apple.')) continue
        const fullPath = path.join(resolved, name)
        if (seen.has(fullPath)) continue
        seen.add(fullPath)

        // Bidirectional prefix matching:
        // - name=com.docker.helper matches id=com.docker (name starts with id)
        // - name=com.docker matches id=com.docker.helper (id starts with name)
        const isInstalled =
          bundleIds.has(name) ||
          appNames.has(name.toLowerCase()) ||
          [...bundleIds].some(id =>
            name === id ||
            name.startsWith(id + '.') ||
            id.startsWith(name + '.')
          )

        if (!isInstalled) {
          orphaned.push({ name, path: fullPath, location: dir })
        }
      }
    } catch {}
  }

  return orphaned
}

// ─── Helper: Get trash size via Finder (bypasses TCC restriction on ~/.Trash) ─
function getTrashSize() {
  try {
    const output = execSync(
      `osascript -e 'tell application "Finder" to get (size of items of trash)'`,
      { timeout: 10000 }
    ).toString().trim()
    return output
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !isNaN(n))
      .reduce((sum, n) => sum + n, 0)
  } catch {
    return 0
  }
}

// ─── Helper: Get directory size via du ───────────────────────────────────────
function getDirSize(targetPath) {
  const resolved = expandPath(targetPath)
  // ~/.Trash is protected by TCC — use Finder via AppleScript instead
  if (resolved === path.join(os.homedir(), '.Trash')) {
    return getTrashSize()
  }
  try {
    const output = execSync(`du -sk "${resolved}" 2>/dev/null`, { timeout: 30000 }).toString()
    const kb = parseInt(output.split('\t')[0], 10)
    return isNaN(kb) ? 0 : kb * 1024
  } catch {
    return 0
  }
}

// ─── Helper: Check if path exists ────────────────────────────────────────────
function pathExists(targetPath) {
  try {
    fs.accessSync(expandPath(targetPath))
    return true
  } catch {
    return false
  }
}

// ─── Helper: Get N largest sub-items ─────────────────────────────────────────
function getChildren(dirPath, max = 25) {
  try {
    const resolved = expandPath(dirPath)
    const entries = fs.readdirSync(resolved, { withFileTypes: true })
    const results = []
    for (const entry of entries) {
      const fullPath = path.join(resolved, entry.name)
      try {
        const size = getDirSize(fullPath)
        results.push({ name: entry.name, path: fullPath, size })
      } catch {
        // skip inaccessible
      }
    }
    results.sort((a, b) => b.size - a.size)
    return results.slice(0, max)
  } catch {
    return []
  }
}

// ─── Window ───────────────────────────────────────────────────────────────────
let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 700,
    minWidth: 860,
    minHeight: 580,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 20 },
    backgroundColor: '#0D0D0D',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    const port = process.env.VITE_PORT || '5173'
    mainWindow.loadURL(`http://localhost:${port}`)
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }
}

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, 'build', 'icon.png')
  if (process.platform === 'darwin' && fs.existsSync(iconPath)) {
    app.dock.setIcon(iconPath)
  }
  createWindow()
  if (autoUpdater) {
    autoUpdater.on('update-available', (info) => {
      mainWindow?.webContents.send('update:available', info)
    })
    autoUpdater.on('update-downloaded', (info) => {
      mainWindow?.webContents.send('update:downloaded', info)
    })
    autoUpdater.on('update-not-available', (info) => {
      mainWindow?.webContents.send('update:notavailable', info)
    })
    autoUpdater.on('error', (err) => {
      mainWindow?.webContents.send('update:error', err?.message || String(err))
    })
    if (!isDev) {
      autoUpdater.checkForUpdatesAndNotify()
    }
  }
})

// ─── Helper: Download file with redirect following ───────────────────────────
function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    const follow = (currentUrl, hops = 0) => {
      if (hops > 10) { reject(new Error('Too many redirects')); return }
      const parsed = new URL(currentUrl)
      const client = parsed.protocol === 'https:' ? require('https') : require('http')
      client.get(currentUrl, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          res.resume()
          follow(res.headers.location, hops + 1)
          return
        }
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
        const total = parseInt(res.headers['content-length'] || '0', 10)
        let downloaded = 0
        const file = fs.createWriteStream(dest)
        res.on('data', chunk => {
          downloaded += chunk.length
          if (total > 0) onProgress(Math.round((downloaded / total) * 100))
        })
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
        file.on('error', err => { try { fs.unlinkSync(dest) } catch {} reject(err) })
      }).on('error', reject)
    }
    follow(url)
  })
}

ipcMain.handle('update:download-and-install', async (event, version) => {
  try {
    const arch = process.arch
    const filename = arch === 'arm64'
      ? `Scythe-${version}-arm64-mac.zip`
      : `Scythe-${version}-mac.zip`
    const url = `https://github.com/peterhagman/Scythe/releases/download/v${version}/${filename}`

    const tmpDir = path.join(os.tmpdir(), `scythe-update-${Date.now()}`)
    const zipPath = path.join(tmpDir, filename)
    fs.mkdirSync(tmpDir, { recursive: true })

    await downloadFile(url, zipPath, (percent) => {
      event.sender.send('update:download-progress', { percent })
    })

    execSync(`unzip -o "${zipPath}" -d "${tmpDir}"`, { timeout: 60000 })

    const newAppSrc = path.join(tmpDir, 'Scythe.app')
    // process.execPath = /path/Scythe.app/Contents/MacOS/Scythe → go up 3 levels
    const appBundlePath = path.resolve(process.execPath, '../../..')

    execSync(`ditto "${newAppSrc}" "${appBundlePath}"`, { timeout: 30000 })
    execSync(`xattr -cr "${appBundlePath}"`, { timeout: 10000 })

    try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch {}

    event.sender.send('update:ready')
    return { ok: true }
  } catch (err) {
    event.sender.send('update:error', err?.message || String(err))
    return { error: err?.message }
  }
})

ipcMain.handle('update:restart', () => {
  app.relaunch()
  app.quit()
})

ipcMain.handle('update:quit', () => {
  app.quit()
})

ipcMain.handle('update:check', async () => {
  // Dev mode: autoUpdater silently skips when app is not packaged — simulate response
  if (isDev || !autoUpdater) {
    setTimeout(() => {
      mainWindow?.webContents.send('update:notavailable', {})
    }, 1200)
    return { ok: true }
  }
  try {
    await autoUpdater.checkForUpdates()
    return { ok: true }
  } catch (err) {
    mainWindow?.webContents.send('update:error', err?.message || String(err))
    return { error: err?.message }
  }
})

ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('app:locale', () => app.getLocale())

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// ─── Scan state ───────────────────────────────────────────────────────────────
let scanAborted = false

// ─── IPC: estimate:all ────────────────────────────────────────────────────────
ipcMain.handle('estimate:all', async (event) => {
  const results = []
  for (const target of SCAN_TARGETS) {
    if (scanAborted) break
    if (target.id === 'orphaned-scan') {
      // Quick discovery — no size calculation to keep estimates fast
      const folders = getOrphanedFolders()
      const exists = folders.length > 0
      results.push({ id: 'orphaned-scan', estimatedSize: 0, exists })
      event.sender.send('estimate:result', { id: 'orphaned-scan', estimatedSize: 0, exists })
      continue
    }
    const exists = pathExists(target.path)
    // Skip getDirSize for Application Support paths — triggers repeated TCC dialogs on startup.
    // Size is calculated during an explicit scan instead.
    const skipSize = target.path.includes('Application Support') || target.path.includes('/Containers/')
    const size = (exists && !skipSize) ? getDirSize(target.path) : 0
    results.push({ id: target.id, estimatedSize: size, exists })
    event.sender.send('estimate:result', { id: target.id, estimatedSize: size, exists })
  }
  return results
})

// ─── IPC: scan:start ──────────────────────────────────────────────────────────
ipcMain.handle('scan:start', async (event, targetIds) => {
  scanAborted = false
  const targets = SCAN_TARGETS.filter(t => targetIds.includes(t.id))
  const results = []

  for (const target of targets) {
    if (scanAborted) break

    // ── Special: orphaned data scan ──────────────────────────────────────────
    if (target.id === 'orphaned-scan') {
      event.sender.send('scan:progress', { id: 'orphaned-scan', name: target.name, status: 'scanning', size: 0 })
      const folders = getOrphanedFolders()
      for (const folder of folders) {
        if (scanAborted) break
        const size = getDirSize(folder.path)
        const itemId = `orphaned:${folder.path}`
        const item = {
          id: itemId,
          name: folder.name,
          nameKey: null,
          category: 'orphaned',
          path: folder.path,
          description: folder.location,
          descKey: null,
          size,
          exists: true,
          safe: false,
          requiresAdmin: false,
          showChildren: false,
          children: [],
        }
        results.push(item)
        event.sender.send('scan:progress', { id: itemId, name: folder.name, status: 'done', size })
      }
      event.sender.send('scan:progress', { id: 'orphaned-scan', name: target.name, status: 'done', size: 0 })
      continue
    }

    event.sender.send('scan:progress', {
      id: target.id,
      name: target.name,
      status: 'scanning',
      size: 0,
    })

    const exists = pathExists(target.path)
    let size = 0
    let children = []

    if (exists) {
      size = getDirSize(target.path)
      if (target.showChildren) {
        children = getChildren(target.path)
      }
    }

    const result = {
      ...target,
      size,
      exists,
      children,
      path: expandPath(target.path),
    }
    results.push(result)

    event.sender.send('scan:progress', {
      id: target.id,
      name: target.name,
      status: 'done',
      size,
    })
  }

  event.sender.send('scan:complete', results)
  return results
})

// ─── IPC: scan:abort ──────────────────────────────────────────────────────────
ipcMain.on('scan:abort', () => {
  scanAborted = true
})

// ─── IPC: delete:items ────────────────────────────────────────────────────────
ipcMain.handle('delete:items', async (event, items) => {
  const results = []
  let totalFreed = 0

  for (const item of items) {
    try {
      if (item.requiresAdmin) {
        const escaped = item.path.replace(/"/g, '\\"')
        execSync(
          `osascript -e 'do shell script "rm -rf \\"${escaped}\\"" with administrator privileges'`,
          { timeout: 60000 }
        )
      } else {
        fs.rmSync(item.path, { recursive: true, force: true })
      }
      results.push({ path: item.path, success: true, size: item.size || 0 })
      totalFreed += item.size || 0
      event.sender.send('delete:progress', { path: item.path, success: true })
    } catch (err) {
      results.push({ path: item.path, success: false, error: err.message })
      event.sender.send('delete:progress', { path: item.path, success: false, error: err.message })
    }
  }

  const summary = { results, totalFreed }
  event.sender.send('delete:complete', summary)
  return summary
})

// ─── IPC: trash:empty ─────────────────────────────────────────────────────────
ipcMain.handle('trash:empty', async () => {
  try {
    const trashPath = path.join(os.homedir(), '.Trash')
    fs.rmSync(trashPath, { recursive: true, force: true })
    fs.mkdirSync(trashPath, { recursive: true })
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// ─── IPC: finder:reveal ───────────────────────────────────────────────────────
ipcMain.handle('finder:reveal', async (_, targetPath) => {
  shell.showItemInFolder(expandPath(targetPath))
  return true
})

// ─── IPC: store:get / store:set ───────────────────────────────────────────────
ipcMain.handle('store:get', async (_, key) => store.get(key))
ipcMain.handle('store:set', async (_, key, value) => {
  store.set(key, value)
  return true
})

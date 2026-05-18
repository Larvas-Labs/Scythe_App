const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { execSync, exec, execFile } = require('child_process')
const fs = require('fs')
const os = require('os')
const Store = require('electron-store')

const store = new Store()
const isDev = !app.isPackaged

app.setName('Scythe')

// ─── Security: allowed config keys ───────────────────────────────────────────
const ALLOWED_CONFIG_KEYS = new Set(['enabledCategories', 'theme', 'language'])

// ─── Security: whitelist of paths from last scan (populated on scan:complete) ─
let lastScanPaths = new Set()

// ─── Security: safe shell quoting for osascript do shell script ───────────────
// Paths run as admin via `do shell script "rm -rf ..."`. Two-level escaping:
//   Level 1 – /bin/sh: wrap path in single quotes; escape literal single quotes as '\''
//   Level 2 – AppleScript string: escape backslashes and double quotes
function buildAdminDeleteScript(filePath) {
  const shQuoted = "'" + filePath.replace(/'/g, "'\\''") + "'"
  const appleEscaped = shQuoted.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `do shell script "rm -rf ${appleEscaped}" with administrator privileges`
}

// ─── Security: validate path is safe to operate on ───────────────────────────
function isAllowedScanPath(p) {
  if (typeof p !== 'string' || !p || !path.isAbsolute(p)) return false
  // Reject null bytes
  if (p.includes('\0')) return false
  // Reject path traversal
  if (p.split('/').some(seg => seg === '..')) return false
  // Must be in whitelist from last scan
  return lastScanPaths.has(p)
}

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

async function getInstalledBundleIdsAsync() {
  const bundleIds = new Set()
  const appNames = new Set()

  // 1. .app bundles in standard app directories — parallel bundle ID lookups
  const appDirs = [
    '/Applications',
    path.join(os.homedir(), 'Applications'),
    '/System/Applications',
  ]
  const bidPromises = []
  for (const dir of appDirs) {
    try {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.name.endsWith('.app')) continue
        appNames.add(entry.name.replace('.app', '').toLowerCase())
        const infoPath = path.join(dir, entry.name, 'Contents', 'Info')
        bidPromises.push(
          new Promise((resolve) => {
            exec(
              `defaults read "${infoPath}" CFBundleIdentifier 2>/dev/null`,
              { timeout: 2000 },
              (err, stdout) => resolve(stdout?.toString().trim() || null)
            )
          })
        )
      }
    } catch {}
  }
  const bids = await Promise.all(bidPromises)
  bids.forEach(bid => { if (bid) bundleIds.add(bid) })

  // 2. Homebrew Cellar (formulae) and Caskroom (casks) — no brew command needed
  const brewPaths = [
    '/opt/homebrew/Cellar',
    '/opt/homebrew/Caskroom',
    '/usr/local/Cellar',
    '/usr/local/Caskroom',
    path.join(os.homedir(), 'homebrew/Cellar'),
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

async function getOrphanedFoldersAsync() {
  const { bundleIds, appNames } = await getInstalledBundleIdsAsync()
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
// Cached with a 60s TTL so that estimate:all (startup) and scan:start (seconds
// later) share the same result — preventing two concurrent Finder calls that
// cause the "Papperskorg är upptagen" busy dialog when empty trash is invoked.
const _trashSizeCache = { size: 0, time: 0 }
function getTrashSizeAsync() {
  if (Date.now() - _trashSizeCache.time < 60000) {
    return Promise.resolve(_trashSizeCache.size)
  }
  return new Promise((resolve) => {
    exec(
      `osascript -e 'tell application "Finder" to get (size of items of trash)'`,
      { timeout: 10000 },
      (err, stdout) => {
        if (err) { resolve(_trashSizeCache.size); return }
        const total = stdout.toString().trim()
          .split(',')
          .map(s => parseInt(s.trim(), 10))
          .filter(n => !isNaN(n))
          .reduce((sum, n) => sum + n, 0)
        _trashSizeCache.size = total
        _trashSizeCache.time = Date.now()
        resolve(total)
      }
    )
  })
}

// Attempt 2 (fallback): if the directory itself is TCC-protected or contains
// protected entries, list its contents and delete each child individually,
// silently skipping any entry that macOS refuses. This lets us reclaim space
// from deletable app-caches even when system-owned subdirs (com.apple.*, etc.)
// are mixed into the same parent directory.
function deletePathBestEffort(targetPath) {
  return new Promise(resolve => {
    execFile('/bin/rm', ['-rf', targetPath], { timeout: 60000 }, err => {
      if (!err) { resolve(); return }
      // Direct deletion failed — try per-entry fallback
      let entries
      try { entries = fs.readdirSync(targetPath) } catch { resolve(); return }
      let pending = entries.length
      if (pending === 0) { resolve(); return }
      for (const entry of entries) {
        execFile('/bin/rm', ['-rf', path.join(targetPath, entry)], { timeout: 30000 }, () => {
          if (--pending === 0) resolve()
        })
      }
    })
  })
}

// ─── Helper: Get directory size via du ───────────────────────────────────────
function getDirSizeAsync(targetPath) {
  const resolved = expandPath(targetPath)
  // ~/.Trash is protected by TCC — use Finder via AppleScript instead
  if (resolved === path.join(os.homedir(), '.Trash')) {
    return getTrashSizeAsync()
  }
  return new Promise((resolve) => {
    exec(`du -sk "${resolved}" 2>/dev/null`, { timeout: 30000 }, (err, stdout) => {
      if (err) { resolve(0); return }
      const kb = parseInt(stdout.split('\t')[0], 10)
      resolve(isNaN(kb) ? 0 : kb * 1024)
    })
  })
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
async function getChildrenAsync(dirPath, max = 25) {
  try {
    const resolved = expandPath(dirPath)
    const entries = fs.readdirSync(resolved, { withFileTypes: true })
    const sized = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(resolved, entry.name)
        try {
          const size = await getDirSizeAsync(fullPath)
          return { name: entry.name, path: fullPath, size }
        } catch {
          return null
        }
      })
    )
    const results = sized.filter(Boolean)
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
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
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
  // Validate version is strict semver — prevents injection via crafted version string
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    return { error: 'Invalid version format' }
  }

  const run = (cmd, args, opts) => new Promise((resolve, reject) => {
    execFile(cmd, args, opts, (err) => { if (err) reject(err); else resolve() })
  })

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

    // Use execFile (no shell) — paths are passed as array args, not interpolated strings
    await run('unzip', ['-o', zipPath, '-d', tmpDir], { timeout: 60000 })

    const newAppSrc = path.join(tmpDir, 'Scythe.app')
    // process.execPath = /path/Scythe.app/Contents/MacOS/Scythe → go up 3 levels
    const appBundlePath = path.resolve(process.execPath, '../../..')

    await run('ditto', [newAppSrc, appBundlePath], { timeout: 30000 })
    await run('xattr', ['-cr', appBundlePath], { timeout: 10000 })

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
  const estimateOne = async (target) => {
    if (target.id === 'orphaned-scan') {
      // Quick discovery — no size calculation to keep estimates fast
      const folders = await getOrphanedFoldersAsync()
      const exists = folders.length > 0
      const result = { id: 'orphaned-scan', estimatedSize: 0, exists }
      event.sender.send('estimate:result', result)
      return result
    }
    const exists = pathExists(target.path)
    // Skip getDirSizeAsync for Application Support paths — triggers repeated TCC dialogs on startup.
    // Size is calculated during an explicit scan instead.
    const skipSize = target.path.includes('Application Support') || target.path.includes('/Containers/')
    const size = (exists && !skipSize) ? await getDirSizeAsync(target.path) : 0
    const result = { id: target.id, estimatedSize: size, exists }
    event.sender.send('estimate:result', result)
    return result
  }
  return Promise.all(SCAN_TARGETS.map(estimateOne))
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
      const folders = await getOrphanedFoldersAsync()
      for (const folder of folders) {
        if (scanAborted) break
        const size = await getDirSizeAsync(folder.path)
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
      size = await getDirSizeAsync(target.path)
      if (target.showChildren) {
        children = await getChildrenAsync(target.path)
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

  // Update path whitelist so delete:items can validate against real scan results
  lastScanPaths = new Set(results.map(r => r.path).filter(Boolean))

  event.sender.send('scan:complete', results)
  return results
})

// ─── IPC: scan:abort ──────────────────────────────────────────────────────────
ipcMain.on('scan:abort', () => {
  scanAborted = true
})

// ─── IPC: delete:items ────────────────────────────────────────────────────────
ipcMain.handle('delete:items', async (event, items) => {
  if (!Array.isArray(items)) return { error: 'Invalid input' }

  const results = []
  let totalFreed = 0

  for (const item of items) {
    // Validate each item before touching the filesystem
    if (!item || typeof item !== 'object' || typeof item.path !== 'string') {
      results.push({ path: String(item?.path), success: false, error: 'Invalid item' })
      continue
    }
    if (!isAllowedScanPath(item.path)) {
      console.error('[delete:items] Rejected path (not in scan whitelist):', item.path)
      results.push({ path: item.path, success: false, error: 'Path not in scan results' })
      continue
    }

    try {
      if (item.requiresAdmin) {
        // Use execFile (no shell) + two-level quoting to prevent injection
        await new Promise((resolve, reject) => {
          execFile(
            'osascript',
            ['-e', buildAdminDeleteScript(item.path)],
            { timeout: 60000 },
            (err) => { if (err) reject(err); else resolve() }
          )
        })
      } else if (item.path === path.join(os.homedir(), '.Trash')) {
        await new Promise((resolve, reject) => {
          execFile('osascript', ['-e', 'tell application "Finder" to empty trash'],
            { timeout: 60000 }, (err) => {
              if (err) {
                const msg = err.message || ''
                const isTrashBusy = /busy|in use|locked|Can't empty/i.test(msg)
                const enriched = new Error(msg)
                if (isTrashBusy) enriched.hint = 'trashBusy'
                reject(enriched)
              } else {
                resolve()
              }
            })
        })
      } else {
        await deletePathBestEffort(item.path)
      }
      results.push({ path: item.path, success: true, size: item.size || 0 })
      totalFreed += item.size || 0
      event.sender.send('delete:progress', { path: item.path, success: true })
    } catch (err) {
      console.error('[delete:items] Failed to delete', item.path, err.message)
      results.push({ path: item.path, success: false, error: err.message, hint: err.hint || null })
      event.sender.send('delete:progress', { path: item.path, success: false, error: err.message, hint: err.hint || null })
    }
  }

  const summary = { results, totalFreed }
  event.sender.send('delete:complete', summary)
  return summary
})

// ─── IPC: trash:empty ─────────────────────────────────────────────────────────
ipcMain.handle('trash:empty', async () => {
  try {
    await new Promise((resolve, reject) => {
      execFile('osascript', ['-e', 'tell application "Finder" to empty trash'],
        { timeout: 60000 }, (err) => { if (err) reject(err); else resolve() })
    })
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
ipcMain.handle('store:get', async (_, key) => {
  if (!ALLOWED_CONFIG_KEYS.has(key)) return undefined
  return store.get(key)
})
ipcMain.handle('store:set', async (_, key, value) => {
  if (!ALLOWED_CONFIG_KEYS.has(key)) return false
  store.set(key, value)
  return true
})

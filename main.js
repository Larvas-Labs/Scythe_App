const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const { execSync, exec } = require('child_process')
const fs = require('fs')
const os = require('os')
const Store = require('electron-store')

const store = new Store()
const isDev = !app.isPackaged

app.setName('Scythe')

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
    name: 'App-cacher',
    category: 'user',
    path: '~/Library/Caches',
    description: 'Cacher skapade av installerade appar',
    showChildren: true,
    safe: true,
    requiresAdmin: false,
    icon: '📦',
  },
  {
    id: 'user-logs',
    name: 'Användarlogs',
    category: 'user',
    path: '~/Library/Logs',
    description: 'Loggfiler från användarens appar',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '📋',
  },
  {
    id: 'trash',
    name: 'Papperskorg',
    category: 'user',
    path: '~/.Trash',
    description: 'Filer i papperskorgen',
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
    description: 'Google Chrome cache',
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
    description: 'Safari webbläsarcache',
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
    description: 'Firefox webbläsarcache',
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
    description: 'Arc webbläsarcache',
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
    description: 'Brave webbläsarcache',
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
    description: 'npm paketcache',
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
    description: 'Yarn paketcache',
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
    description: 'pnpm paketstore – radering kan påverka projekt',
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
    description: 'Homebrew nedladdningscache',
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
    description: 'Xcode byggartefakter och index',
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
    description: 'Xcode arkiverade builds – behåll om du distribuerar appar',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '📁',
  },
  {
    id: 'ios-simulators',
    name: 'iOS Simulatorer',
    category: 'developer',
    path: '~/Library/Developer/CoreSimulator/Devices',
    description: 'iOS/iPadOS simulatordata',
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
    description: 'Slack cachade resurser',
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
    description: 'Spotify cachad musik',
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
    description: 'Zoom mötesdata och cache',
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
    description: 'Visual Studio Code cache',
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
    description: 'Figma cachade designresurser',
    showChildren: false,
    safe: true,
    requiresAdmin: false,
    icon: '🎨',
  },
  {
    id: 'docker-data',
    name: 'Docker data',
    category: 'apps',
    path: '~/Library/Containers/com.docker.docker/Data',
    description: 'Docker images och volymer – radering stoppar containers',
    showChildren: false,
    safe: false,
    requiresAdmin: false,
    icon: '🐳',
  },
  // ADVANCED
  {
    id: 'system-caches',
    name: 'Systemcacher',
    category: 'advanced',
    path: '/Library/Caches',
    description: 'macOS-systemcacher – kräver administratörslösenord',
    showChildren: false,
    safe: false,
    requiresAdmin: true,
    icon: '⚙️',
  },
  {
    id: 'system-logs',
    name: 'Systemloggar',
    category: 'advanced',
    path: '/var/log',
    description: 'macOS systemloggar – kräver administratörslösenord',
    showChildren: false,
    safe: false,
    requiresAdmin: true,
    icon: '📄',
  },
  {
    id: 'temp-system',
    name: 'Temporära systemfiler',
    category: 'advanced',
    path: '/private/var/folders',
    description: 'macOS temporära filer – kräver administratörslösenord',
    showChildren: false,
    safe: false,
    requiresAdmin: true,
    icon: '🗂️',
  },
]

// ─── Helper: Get directory size via du ───────────────────────────────────────
function getDirSize(targetPath) {
  try {
    const resolved = expandPath(targetPath)
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
    backgroundColor: '#07080F',
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

app.whenReady().then(createWindow)

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
    const exists = pathExists(target.path)
    const size = exists ? getDirSize(target.path) : 0
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

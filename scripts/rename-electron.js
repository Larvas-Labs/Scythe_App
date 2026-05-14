#!/usr/bin/env node
// Patches the Electron dev binary's Info.plist so the menu bar shows "Scythe"
// instead of "Electron". Runs automatically via postinstall.
const fs = require('fs')
const path = require('path')

const plistPath = path.join(
  __dirname, '..', 'node_modules', 'electron', 'dist',
  'Electron.app', 'Contents', 'Info.plist'
)

if (!fs.existsSync(plistPath)) {
  console.log('[rename-electron] Info.plist not found, skipping.')
  process.exit(0)
}

let plist = fs.readFileSync(plistPath, 'utf8')

// Replace CFBundleName
plist = plist.replace(
  /<key>CFBundleName<\/key>\s*<string>Electron<\/string>/,
  '<key>CFBundleName</key>\n\t<string>Scythe</string>'
)

// Replace CFBundleDisplayName
plist = plist.replace(
  /<key>CFBundleDisplayName<\/key>\s*<string>Electron<\/string>/,
  '<key>CFBundleDisplayName</key>\n\t<string>Scythe</string>'
)

fs.writeFileSync(plistPath, plist, 'utf8')
console.log('[rename-electron] Patched Electron.app → Scythe')

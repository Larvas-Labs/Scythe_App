#!/usr/bin/env node
// Polls localhost:5173 until Vite responds, then launches Electron.
const http = require('http')
const { spawn } = require('child_process')

function poll() {
  const req = http.get('http://localhost:5173/', (res) => {
    res.resume()
    console.log('[electron:dev] Vite ready — launching Electron...')
    const env = { ...process.env, NODE_ENV: 'development' }
    const child = spawn('electron', ['.'], { stdio: 'inherit', env })
    child.on('close', (code) => process.exit(code ?? 0))
  })
  req.on('error', () => setTimeout(poll, 300))
  req.setTimeout(500, () => { req.destroy(); setTimeout(poll, 300) })
}

poll()

#!/usr/bin/env node
// Polls Vite ports (5173, 5174, 5175) until one responds, then launches Electron.
const http = require('http')
const { spawn } = require('child_process')

const PORTS = [5173, 5174, 5175]
let portIndex = 0

function tryPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      res.resume()
      resolve(port)
    })
    req.on('error', () => resolve(null))
    req.setTimeout(400, () => { req.destroy(); resolve(null) })
  })
}

async function poll() {
  for (const port of PORTS) {
    const found = await tryPort(port)
    if (found) {
      console.log(`[electron:dev] Vite ready on :${found} — launching Electron...`)
      const env = { ...process.env, NODE_ENV: 'development', VITE_PORT: String(found) }
      const child = spawn('electron', ['.'], { stdio: 'inherit', env })
      child.on('close', (code) => process.exit(code ?? 0))
      return
    }
  }
  setTimeout(poll, 300)
}

poll()

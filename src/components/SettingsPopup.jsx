import React, { useEffect, useRef } from 'react'

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function RefreshIcon({ spinning = false }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={spinning ? { animation: 'spin 0.9s linear infinite' } : undefined}
    >
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

export default function SettingsPopup({
  theme,
  onToggleTheme,
  onClose,
  updateState,
  appVersion,
  onCheckForUpdates,
  onDownloadAndInstall,
}) {
  const ref = useRef(null)

  useEffect(() => {
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const isDark = theme === 'dark'
  const isChecking = updateState === 'checking'
  const isDownloading = updateState === 'downloading'
  const isBusy = isChecking || isDownloading

  function getUpdateButtonProps() {
    switch (updateState) {
      case 'checking':    return { icon: <RefreshIcon spinning />, color: 'var(--text-secondary)', title: 'Söker...' }
      case 'downloading': return { icon: <RefreshIcon spinning />, color: 'var(--accent)',          title: 'Laddar ned...' }
      case 'uptodate':    return { icon: <CheckIcon />,            color: 'var(--accent)',          title: 'Senaste versionen' }
      case 'available':   return { icon: <DownloadIcon />,         color: 'var(--accent)',          title: 'Ny version tillgänglig' }
      case 'error':       return { icon: <AlertIcon />,            color: 'var(--danger)',          title: 'Kontrollera anslutning' }
      default:            return { icon: <RefreshIcon />,          color: 'var(--text-secondary)', title: 'Sök efter uppdatering' }
    }
  }

  function getStatusText() {
    switch (updateState) {
      case 'uptodate':    return { text: 'Senaste versionen', color: 'var(--accent)' }
      case 'downloading': return { text: 'Laddar ned uppdatering...', color: 'var(--text-secondary)' }
      case 'error':       return { text: 'Kontrollera anslutning', color: 'var(--danger)' }
      default:            return null
    }
  }

  const { icon, color, title } = getUpdateButtonProps()
  const status = getStatusText()

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '56px',
        left: '8px',
        width: '224px',
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        padding: '6px',
        zIndex: 200,
      }}
    >
      {/* ── Utseende ─────────────────────────────── */}
      <div style={sectionLabel}>Utseende</div>

      <div style={row}>
        <span style={rowText}>Tema</span>
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          title={isDark ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div style={divider} />

      {/* ── Uppdateringar ─────────────────────────── */}
      <div style={sectionLabel}>Uppdateringar</div>

      <div style={row}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={rowText}>
            {appVersion ? `Version ${appVersion}` : 'Version'}
          </span>
          {status && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: status.color,
              lineHeight: 1.3,
            }}>
              {status.text}
            </span>
          )}
        </div>

        <button
          onClick={!isBusy && updateState !== 'available' ? onCheckForUpdates : undefined}
          title={title}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isBusy ? 'default' : 'pointer',
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!isBusy) {
              e.currentTarget.style.background = 'var(--surface-hover)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color = updateState === 'error' ? 'var(--danger)' : (updateState ? 'var(--accent)' : 'var(--text)')
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--surface)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = color
          }}
        >
          {icon}
        </button>
      </div>

      {/* Download + install button when update is available */}
      {updateState === 'available' && (
        <div style={{ padding: '2px 4px 4px' }}>
          <button
            onClick={onDownloadAndInstall}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: '6px',
              background: 'var(--accent)',
              border: 'none',
              color: '#0D0D0D',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Hämta ny version och starta om
          </button>
        </div>
      )}
    </div>
  )
}

const sectionLabel = {
  fontFamily: 'var(--font-body)',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  padding: '6px 8px 4px',
}

const row = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px 4px 4px 8px',
  borderRadius: '6px',
  minHeight: '40px',
}

const rowText = {
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--text)',
}

const divider = {
  height: '1px',
  background: 'var(--border)',
  margin: '4px 0',
}

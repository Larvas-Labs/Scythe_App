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

// Idle / checking
function RefreshIcon({ spinning = false }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={spinning ? { animation: 'spin 0.9s linear infinite' } : undefined}
    >
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  )
}

// Up to date
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// Available — download
function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

// Downloaded — restart
function RestartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <polyline points="3 3 3 8 8 8"/>
    </svg>
  )
}

// Error
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
  onRestart,
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

  // Per-state: icon, color, tooltip, onClick, statusText
  const STATE_CONFIG = {
    null: {
      icon: <RefreshIcon />,
      color: 'var(--text-secondary)',
      title: 'Sök efter uppdatering',
      onClick: onCheckForUpdates,
      status: null,
    },
    checking: {
      icon: <RefreshIcon spinning />,
      color: 'var(--text-secondary)',
      title: 'Söker...',
      onClick: null,
      status: null,
    },
    uptodate: {
      icon: <CheckIcon />,
      color: 'var(--accent)',
      title: 'Senaste versionen installerad',
      onClick: null,
      status: { text: 'Senaste versionen', color: 'var(--accent)' },
    },
    available: {
      icon: <DownloadIcon />,
      color: 'var(--accent)',
      title: 'Hämta och installera uppdatering',
      onClick: onDownloadAndInstall,
      status: { text: 'Ny version tillgänglig', color: 'var(--accent)' },
    },
    downloading: {
      icon: <RefreshIcon spinning />,
      color: 'var(--accent)',
      title: 'Laddar ned...',
      onClick: null,
      status: { text: 'Hämtar...', color: 'var(--text-secondary)' },
    },
    downloaded: {
      icon: <RestartIcon />,
      color: 'var(--accent)',
      title: 'Starta om och installera',
      onClick: onRestart,
      status: { text: 'Starta om', color: 'var(--accent)' },
    },
    error: {
      icon: <AlertIcon />,
      color: 'var(--danger)',
      title: 'Kontrollera anslutning',
      onClick: null,
      status: { text: 'Kontrollera anslutning', color: 'var(--danger)' },
    },
  }

  const cfg = STATE_CONFIG[updateState] ?? STATE_CONFIG[null]
  const isBusy = updateState === 'checking' || updateState === 'downloading'

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
          {cfg.status && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              color: cfg.status.color,
              lineHeight: 1.3,
            }}>
              {cfg.status.text}
            </span>
          )}
        </div>

        <button
          onClick={!isBusy && cfg.onClick ? cfg.onClick : undefined}
          title={cfg.title}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: cfg.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isBusy || !cfg.onClick ? 'default' : 'pointer',
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            if (!isBusy && cfg.onClick) {
              e.currentTarget.style.background = 'var(--surface-hover)'
              e.currentTarget.style.borderColor = 'var(--border-strong)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--surface)'
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        >
          {cfg.icon}
        </button>
      </div>
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

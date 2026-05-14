import React from 'react'

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

export default function TopBar({ appState, onNewScan, onStartScan, theme, onToggleTheme }) {
  return (
    <div
      style={{
        height: '52px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '80px',
        paddingRight: '12px',
        flexShrink: 0,
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <div />

      {/* Right side — no drag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', WebkitAppRegion: 'no-drag' }}>
        {/* Theme toggle — always visible */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Byt till ljust läge' : 'Byt till mörkt läge'}
          aria-label="Växla tema"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Scan button */}
        {onStartScan && (
          <button
            className="btn-primary"
            style={{ padding: '7px 16px' }}
            onClick={onStartScan}
          >
            Kör scanning
          </button>
        )}
        {onNewScan && (
          <button
            className="btn-ghost"
            style={{ padding: '7px 16px' }}
            onClick={onNewScan}
          >
            Ny scanning
          </button>
        )}
      </div>
    </div>
  )
}

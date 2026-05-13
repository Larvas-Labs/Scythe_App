import React from 'react'

export default function TopBar({ appState, onNewScan, onStartScan }) {
  return (
    <div
      style={{
        height: '56px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '72px',
        paddingRight: '16px',
        flexShrink: 0,
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.04em',
          background: 'var(--gradient-scythe)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        SCYTHE
      </span>

      <div style={{ WebkitAppRegion: 'no-drag' }}>
        {onStartScan && (
          <button
            className="btn-gradient"
            style={{ padding: '7px 20px', borderRadius: '8px', fontSize: '0.875rem' }}
            onClick={onStartScan}
          >
            Kör scanning
          </button>
        )}
        {onNewScan && (
          <button
            onClick={onNewScan}
            style={{
              padding: '7px 20px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.target.style.background = 'var(--surface-hover)'}
            onMouseLeave={e => e.target.style.background = 'var(--surface)'}
          >
            Ny scanning
          </button>
        )}
      </div>
    </div>
  )
}

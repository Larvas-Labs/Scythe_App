import React from 'react'

export default function UpdateBanner({ updateState, onInstall }) {
  if (!updateState) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '7px 20px',
        background: updateState === 'downloaded'
          ? 'rgba(255, 149, 0, 0.12)'
          : 'rgba(255, 149, 0, 0.07)',
        borderBottom: '1px solid rgba(255, 149, 0, 0.20)',
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        {updateState === 'available' && 'Ny version laddas ned...'}
        {updateState === 'downloaded' && 'Uppdatering klar och redo att installeras.'}
      </span>

      {updateState === 'downloaded' && (
        <button
          onClick={onInstall}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--accent)',
            background: 'none',
            border: '1px solid rgba(255, 149, 0, 0.40)',
            borderRadius: '6px',
            padding: '3px 10px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 149, 0, 0.10)'}
          onMouseLeave={e => e.currentTarget.style.background = 'none'}
        >
          Installera och starta om
        </button>
      )}
    </div>
  )
}

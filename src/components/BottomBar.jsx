import React from 'react'
import { formatSize } from '../utils.js'

export default function BottomBar({ selectedCount, selectedSize, trashSize, onHarvest, onEmptyTrash }) {
  const hasSelection = selectedCount > 0
  const hasTrash = trashSize > 0

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 20,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem',
            color: hasSelection ? 'var(--text)' : 'var(--text-muted)',
          }}
        >
          {hasSelection ? (
            <>
              <span style={{ fontWeight: 600 }}>{selectedCount}</span>
              {' '}valda{' '}
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              {' '}
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: 'var(--accent-green)',
                }}
              >
                {formatSize(selectedSize)}
              </span>
              {' '}frigörs
            </>
          ) : (
            'Välj filer att rensa'
          )}
        </span>

        {hasTrash && (
          <button
            onClick={onEmptyTrash}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.8rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--danger)'
              e.currentTarget.style.color = 'var(--danger)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            Töm papperskorg ({formatSize(trashSize)})
          </button>
        )}
      </div>

      <button
        className="btn-danger"
        disabled={!hasSelection}
        onClick={onHarvest}
        style={{
          padding: '10px 28px',
          borderRadius: '10px',
          fontSize: '0.95rem',
          opacity: hasSelection ? 1 : 0.4,
          cursor: hasSelection ? 'pointer' : 'not-allowed',
        }}
      >
        🌾 Harvest
      </button>
    </div>
  )
}

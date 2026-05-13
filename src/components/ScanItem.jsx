import React from 'react'
import { formatSize, cn } from '../utils.js'

export default function ScanItem({ result, selected, onToggle }) {
  const notFound = !result.exists
  const isUnsafe = !result.safe

  function handleReveal(e) {
    e.stopPropagation()
    window.scythe.revealInFinder(result.path)
  }

  return (
    <div
      onClick={() => !notFound && onToggle(result.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px 10px 32px',
        borderRadius: '8px',
        marginBottom: '2px',
        cursor: notFound ? 'default' : 'pointer',
        background: selected ? 'var(--surface)' : 'transparent',
        border: `1px solid ${selected ? 'var(--border)' : 'transparent'}`,
        opacity: notFound ? 0.4 : 1,
        transition: 'background 0.1s, border-color 0.1s',
      }}
      onMouseEnter={e => {
        if (!notFound && !selected) e.currentTarget.style.background = 'var(--surface-hover)'
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.background = 'transparent'
      }}
    >
      <div
        className={cn('custom-checkbox', selected && 'checked')}
        style={{ pointerEvents: 'none' }}
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{result.icon}</span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {result.name}
          {isUnsafe && <span style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>⚠️</span>}
          {result.requiresAdmin && (
            <span
              style={{
                background: 'rgba(255,184,0,0.12)',
                color: 'var(--warning)',
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '1px 5px',
                borderRadius: '4px',
                letterSpacing: '0.03em',
              }}
            >
              ADMIN
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notFound ? 'Hittades inte' : result.description}
        </div>
      </div>

      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        {notFound ? (
          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
        ) : (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: result.size > 0 ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {formatSize(result.size)}
          </span>
        )}
      </div>

      {!notFound && (
        <button
          onClick={handleReveal}
          title="Visa i Finder"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--accent-blue)'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          ↗
        </button>
      )}
    </div>
  )
}

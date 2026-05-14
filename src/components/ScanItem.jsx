import React from 'react'
import { formatSize, cn } from '../utils.js'

export default function ScanItem({ result, selected, onToggle, isLast }) {
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
        padding: '10px 14px',
        borderBottom: isLast ? 'none' : '1px solid var(--border)',
        cursor: notFound ? 'default' : 'pointer',
        background: selected ? 'var(--surface-hover)' : 'transparent',
        opacity: notFound ? 0.4 : 1,
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => {
        if (!notFound && !selected) e.currentTarget.style.background = 'var(--surface-hover)'
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.background = 'transparent'
      }}
    >
      {/* Checkbox */}
      <div
        className={cn('s-checkbox', selected && 'checked')}
        style={{ pointerEvents: 'none' }}
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{result.icon}</span>

      {/* Name + description */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-body)',
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
                background: 'oklch(80% 0.175 73 / 0.12)',
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
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginTop: '1px',
          }}
        >
          {notFound ? 'Hittades inte' : result.description}
        </div>
      </div>

      {/* Size — hero element per §10 */}
      <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '60px' }}>
        {notFound ? (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>—</span>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1rem',
              fontWeight: 500,
              color: result.size > 0 ? 'var(--text)' : 'var(--text-muted)',
            }}
          >
            {formatSize(result.size)}
          </span>
        )}
      </div>

      {/* Reveal in Finder */}
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
            fontSize: '0.9rem',
            lineHeight: 1,
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

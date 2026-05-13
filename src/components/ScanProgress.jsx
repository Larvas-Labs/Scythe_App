import React from 'react'
import { formatSize } from '../utils.js'

export default function ScanProgress({ progress, completedCount, totalCount, onAbort }) {
  const items = Object.values(progress)
  const currentItem = items.find(i => i.status === 'scanning')
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 700,
            fontSize: '1.4rem',
            color: 'var(--text)',
            margin: 0,
            marginBottom: '6px',
          }}
        >
          Skannar din Mac...
        </h2>
        {currentItem && (
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              margin: 0,
            }}
          >
            Skannar {currentItem.name}...
          </p>
        )}
      </div>

      <div
        style={{
          width: '100%',
          height: '6px',
          background: 'var(--surface)',
          borderRadius: '4px',
          marginBottom: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          marginBottom: '24px',
        }}
      >
        {completedCount} av {totalCount} kategorier klara
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              opacity: item.status === 'done' ? 1 : 0.6,
            }}
          >
            {item.status === 'done' ? (
              <span style={{ color: 'var(--accent-green)', fontSize: '0.9rem' }}>✓</span>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>◌</span>
            )}

            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                color: item.status === 'done' ? 'var(--text)' : 'var(--text-secondary)',
                flex: 1,
              }}
            >
              {item.name}
            </span>

            {item.status === 'done' && item.size > 0 && (
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.8rem',
                  color: 'var(--accent-green)',
                }}
              >
                {formatSize(item.size)}
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onAbort}
        style={{
          marginTop: '24px',
          padding: '10px 24px',
          borderRadius: '8px',
          background: 'transparent',
          border: '1px solid var(--border-strong)',
          color: 'var(--text-secondary)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={e => {
          e.target.style.borderColor = 'var(--danger)'
          e.target.style.color = 'var(--danger)'
        }}
        onMouseLeave={e => {
          e.target.style.borderColor = 'var(--border-strong)'
          e.target.style.color = 'var(--text-secondary)'
        }}
      >
        Avbryt
      </button>
    </div>
  )
}

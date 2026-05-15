import React from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

export default function DeleteModal({ items, onConfirm, onCancel }) {
  const { t } = useLang()
  const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0)
  const hasAdmin = items.some(i => i.requiresAdmin)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 8, 15, 0.88)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: '16px',
          padding: '28px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>⚠️</div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--text)',
              margin: 0,
              marginBottom: '6px',
            }}
          >
            {t('modal.title')}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {t('modal.warning')}
          </p>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map(item => (
            <div
              key={item.id || item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{item.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>
                  {item.name}
                  {item.requiresAdmin && (
                    <span
                      style={{
                        marginLeft: '6px',
                        background: 'rgba(255,184,0,0.12)',
                        color: 'var(--warning)',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: '4px',
                      }}
                    >
                      ADMIN
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.path}
                </div>
              </div>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text)',
                  flexShrink: 0,
                }}
              >
                {formatSize(item.size)}
              </span>
            </div>
          ))}
        </div>

        {hasAdmin && (
          <div
            style={{
              background: 'rgba(255, 184, 0, 0.08)',
              border: '1px solid rgba(255, 184, 0, 0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'var(--warning)',
              lineHeight: 1.5,
            }}
          >
            {t('modal.adminNote')}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--text-muted)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            {t('modal.cancel')}
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            {t('modal.confirm', { size: formatSize(totalSize) })}
          </button>
        </div>
      </div>
    </div>
  )
}

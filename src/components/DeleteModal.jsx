import React from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'
import { ITEM_ICON_MAP } from './Icons.jsx'

function WarningIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

export default function DeleteModal({ items, onConfirm, onCancel }) {
  const { t } = useLang()
  const totalSize = items.reduce((sum, item) => sum + (item.size || 0), 0)
  const hasAdmin = items.some(i => i.requiresAdmin)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
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
          borderRadius: '12px',
          maxWidth: '440px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--danger)', display: 'flex' }}>
              <WarningIcon />
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--text)',
              margin: 0,
            }}>
              {t('modal.title')}
            </h2>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            {t('modal.warning')}
          </p>
        </div>

        {/* Item list */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {items.map((item, i) => {
            const IconComp = ITEM_ICON_MAP[item.id]
            return (
              <div
                key={item.id || item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 20px',
                  borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                {IconComp && (
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0, display: 'flex' }}>
                    <IconComp size={14} />
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    color: 'var(--text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {item.name}
                    {item.requiresAdmin && (
                      <span style={{
                        background: 'rgba(255,184,0,0.10)',
                        color: 'var(--warning)',
                        fontSize: '0.6rem',
                        fontWeight: 600,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        letterSpacing: '0.04em',
                      }}>
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginTop: '1px',
                  }}>
                    {item.path}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: item.size > 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {formatSize(item.size)}
                </span>
              </div>
            )
          })}
        </div>

        {/* Admin note */}
        {hasAdmin && (
          <div style={{
            margin: '0 16px',
            padding: '8px 12px',
            background: 'rgba(255,184,0,0.06)',
            border: '1px solid rgba(255,184,0,0.16)',
            borderRadius: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--warning)',
            lineHeight: 1.5,
          }}>
            {t('modal.adminNote')}
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          borderTop: '1px solid var(--border)',
        }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 500,
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
            onClick={onConfirm}
            style={{
              flex: 2,
              padding: '9px 0',
              borderRadius: '8px',
              background: 'var(--danger)',
              border: '1px solid var(--danger)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            {t('modal.confirm', { size: formatSize(totalSize) })}
          </button>
        </div>
      </div>
    </div>
  )
}

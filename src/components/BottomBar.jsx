import React from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

export default function BottomBar({ selectedCount, selectedSize, trashSize, onHarvest, onEmptyTrash }) {
  const { t } = useLang()
  const hasSelection = selectedCount > 0
  const hasTrash = trashSize > 0

  return (
    <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(80, 200, 120, 0.06)',
          border: '1px solid rgba(80, 200, 120, 0.24)',
          borderRadius: '14px',
          boxShadow: '0 8px 32px rgba(80, 200, 120, 0.10)',
        }}
      >
        {/* Left: selection info + empty trash */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: hasSelection ? 'var(--text-secondary)' : 'var(--text-muted)',
              }}
            >
              {hasSelection
                ? t('bottombar.selected', { n: selectedCount })
                : t('bottombar.selectFiles')}
            </span>
            {hasSelection && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}
              >
                {formatSize(selectedSize)}{' '}
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {t('bottombar.freed')}
                </span>
              </span>
            )}
          </div>

          {hasTrash && (
            <button
              onClick={onEmptyTrash}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'transparent',
                border: '1px solid var(--border-strong)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
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
              {t('bottombar.emptyTrash', { size: formatSize(trashSize) })}
            </button>
          )}
        </div>

        {/* Harvest button */}
        <button
          disabled={!hasSelection}
          onClick={onHarvest}
          style={{
            padding: '10px 32px',
            borderRadius: '10px',
            background: hasSelection ? 'rgb(72, 187, 110)' : 'transparent',
            border: hasSelection ? '1px solid rgb(72, 187, 110)' : '1px solid var(--border-strong)',
            color: hasSelection ? '#0d1a10' : 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            cursor: hasSelection ? 'pointer' : 'not-allowed',
            transition: 'opacity 0.15s, transform 0.1s',
            boxShadow: hasSelection ? '0 0 24px rgba(72, 187, 110, 0.25)' : 'none',
          }}
          onMouseEnter={e => { if (hasSelection) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          onMouseDown={e => { if (hasSelection) e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {t('bottombar.harvest')}
        </button>
      </div>
    </div>
  )
}

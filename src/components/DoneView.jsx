import React from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

export default function DoneView({ deleteResult, onNewScan }) {
  const { t } = useLang()
  if (!deleteResult) return null

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '440px',
        width: '100%',
      }}>
        {/* Checkmark */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(255, 149, 0, 0.12)',
          border: '1px solid rgba(255, 149, 0, 0.30)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
            <path
              d="M2 9L8.5 15.5L22 2"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Size freed */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '40px',
          lineHeight: 1.05,
          color: 'var(--accent)',
          marginBottom: '6px',
        }}>
          {formatSize(deleteResult.totalFreed)}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '28px',
        }}>
          {t('done.freed')}
        </div>

        {/* Item list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
          {deleteResult.results.filter(r => r.success).map(r => (
            <div
              key={r.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '7px',
              }}
            >
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5L4 8L11 1" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'left',
              }}>
                {r.path}
              </span>
            </div>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={onNewScan}
          style={{ padding: '11px 36px', borderRadius: '8px', fontSize: '14px' }}
        >
          {t('done.newScan')}
        </button>
      </div>
    </div>
  )
}

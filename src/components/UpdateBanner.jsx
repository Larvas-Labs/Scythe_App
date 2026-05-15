import React from 'react'
import { useLang } from '../i18n/index.jsx'

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="1" y1="1" x2="13" y2="13"/>
      <line x1="13" y1="1" x2="1" y2="13"/>
    </svg>
  )
}

export default function UpdateBanner({
  updateState,
  availableVersion,
  downloadProgress,
  onDownload,
  onDismiss,
  onRestart,
  onQuit,
}) {
  const { t } = useLang()

  if (!['available', 'downloading', 'ready'].includes(updateState)) return null

  return (
    <div style={{
      background: 'var(--accent-dim)',
      borderBottom: '1px solid var(--border)',
      padding: '7px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexShrink: 0,
    }}>

      {updateState === 'available' && (
        <>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            flex: 1,
          }}>
            {t('banner.newVersion')}
            {availableVersion && (
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginLeft: '6px' }}>
                v{availableVersion}
              </span>
            )}
          </span>
          <button
            onClick={onDownload}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: '5px',
              padding: '3px 10px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {t('banner.download')}
          </button>
          <button
            onClick={onDismiss}
            title={t('banner.hide')}
            style={{
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              borderRadius: '4px',
              flexShrink: 0,
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-secondary)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <CloseIcon />
          </button>
        </>
      )}

      {updateState === 'downloading' && (
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}>
            {t('banner.downloading')}
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginLeft: '6px' }}>
              {downloadProgress}%
            </span>
          </div>
          <div style={{
            height: '3px',
            background: 'var(--border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${downloadProgress}%`,
              background: 'var(--accent)',
              borderRadius: '2px',
              transition: 'width 0.2s ease',
            }} />
          </div>
        </div>
      )}

      {updateState === 'ready' && (
        <>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            flex: 1,
          }}>
            {t('banner.updateInstalled')}
          </span>
          <button
            onClick={onRestart}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid var(--accent)',
              borderRadius: '5px',
              padding: '3px 10px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {t('banner.restartApp')}
          </button>
          <button
            onClick={onQuit}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: '5px',
              padding: '3px 10px',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'color 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {t('banner.quitApp')}
          </button>
        </>
      )}

    </div>
  )
}

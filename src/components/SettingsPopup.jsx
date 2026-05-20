import React, { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/index.jsx'

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
      <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

// Idle / checking
function RefreshIcon({ spinning = false }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={spinning ? { animation: 'spin 0.9s linear infinite' } : undefined}
    >
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  )
}

// Up to date
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// Available — download
function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  )
}

// Error
function AlertIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

// Globe icon for language picker trigger
function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

export default function SettingsPopup({
  theme,
  onToggleTheme,
  onClose,
  updateState,
  availableVersion,
  downloadProgress,
  appVersion,
  onCheckForUpdates,
  onDownloadAndInstall,
  onRestart,
  onQuit,
  language,
  onChangeLanguage,
  trackingEnabled,
  onToggleTracking,
}) {
  const ref = useRef(null)
  const [showLangList, setShowLangList] = useState(false)
  const { t, LANGUAGES } = useLang()

  useEffect(() => {
    function onMouseDown(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const isDark = theme === 'dark'
  const isDownloading = updateState === 'downloading'
  const isReady = updateState === 'ready'

  const ICON_CONFIG = {
    null:     { icon: <RefreshIcon />,          color: 'var(--text-secondary)', titleKey: 'settings.checkConnection', onClick: onCheckForUpdates },
    checking: { icon: <RefreshIcon spinning />, color: 'var(--text-secondary)', titleKey: 'settings.searching',       onClick: null },
    uptodate: { icon: <CheckIcon />,            color: 'var(--accent)',          titleKey: 'settings.latestVersion',   onClick: null },
    error:    { icon: <AlertIcon />,            color: 'var(--danger)',          titleKey: 'settings.checkConnection', onClick: null },
  }
  const cfg = ICON_CONFIG[updateState] ?? ICON_CONFIG[null]
  const showIconButton = !['available', 'downloading', 'ready'].includes(updateState)

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '56px',
        left: '8px',
        width: '224px',
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        padding: '6px',
        zIndex: 200,
      }}
    >
      {/* ── Appearance ─────────────────────────────── */}
      <div style={sectionLabel}>{t('settings.appearance')}</div>

      <div style={row}>
        <span style={rowText}>{isDark ? 'Dark' : 'Light'}</span>
        <button
          onClick={onToggleTheme}
          className="theme-toggle"
          title={isDark ? t('settings.toLightMode') : t('settings.toDarkMode')}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div style={divider} />

      {/* ── Updates ─────────────────────────── */}
      <div style={sectionLabel}>{t('settings.updates')}</div>

      {showIconButton && (
        <div style={row}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={rowText}>{appVersion ? `${t('settings.version')} ${appVersion}` : t('settings.version')}</span>
            {updateState === 'uptodate' && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--accent)', lineHeight: 1.3 }}>
                {t('settings.latestVersion')}
              </span>
            )}
            {updateState === 'error' && (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--danger)', lineHeight: 1.3 }}>
                {t('settings.checkConnection')}
              </span>
            )}
          </div>
          <button
            onClick={cfg.onClick || undefined}
            title={t(cfg.titleKey)}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: cfg.onClick ? 'pointer' : 'default',
              transition: 'background 0.15s, border-color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (cfg.onClick) { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {cfg.icon}
          </button>
        </div>
      )}

      {updateState === 'available' && (
        <div style={{ padding: '4px 4px 4px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={rowText}>{appVersion ? `${t('settings.version')} ${appVersion}` : t('settings.version')}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--accent)', marginBottom: '8px' }}>
            {t('settings.newVersionAvailable', { version: availableVersion || '' })}
          </div>
          <button
            onClick={onDownloadAndInstall}
            style={{
              width: '100%', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
              color: 'var(--accent)', background: 'transparent',
              border: '1px solid var(--accent)', borderRadius: '6px',
              padding: '6px 0', cursor: 'pointer', transition: 'background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {t('settings.update')}
          </button>
        </div>
      )}

      {isDownloading && (
        <div style={{ padding: '4px 8px 8px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{t('settings.downloading')}</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{downloadProgress}%</span>
          </div>
          <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${downloadProgress}%`, background: 'var(--accent)', borderRadius: '2px', transition: 'width 0.2s ease' }} />
          </div>
        </div>
      )}

      {isReady && (
        <div style={{ padding: '4px 4px 4px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--accent)' }}>
            {t('settings.updateInstalled')}
          </span>
          <button
            onClick={onRestart}
            style={{
              width: '100%', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 600,
              color: 'var(--accent)', background: 'transparent',
              border: '1px solid var(--accent)', borderRadius: '6px',
              padding: '6px 0', cursor: 'pointer', transition: 'background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {t('settings.restartApp')}
          </button>
          <button
            onClick={onQuit}
            style={{
              width: '100%', fontFamily: 'var(--font-body)', fontSize: '12px',
              color: 'var(--text-secondary)', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '6px',
              padding: '6px 0', cursor: 'pointer', transition: 'color 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {t('settings.quitApp')}
          </button>
        </div>
      )}

      <div style={divider} />

      {/* ── Privacy ──────────────────────────── */}
      <div style={sectionLabel}>{t('settings.privacy')}</div>

      <div style={row}>
        <span style={rowText}>{t('settings.analytics')}</span>
        <button
          onClick={onToggleTracking}
          title={t('settings.analytics')}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            border: `1px solid ${trackingEnabled ? 'var(--accent)' : 'var(--border)'}`,
            background: trackingEnabled ? 'var(--accent-dim)' : 'var(--surface)',
            color: trackingEnabled ? 'var(--accent)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = trackingEnabled ? 'var(--accent-dim)' : 'var(--surface-hover)'; e.currentTarget.style.borderColor = trackingEnabled ? 'var(--accent)' : 'var(--border-strong)' }}
          onMouseLeave={e => { e.currentTarget.style.background = trackingEnabled ? 'var(--accent-dim)' : 'var(--surface)'; e.currentTarget.style.borderColor = trackingEnabled ? 'var(--accent)' : 'var(--border)' }}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="2" fill="currentColor" />
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3" />
            <line x1="6" y1="0.5" x2="6" y2="1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="6" y1="10.5" x2="6" y2="11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="0.5" y1="6" x2="1.5" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="10.5" y1="6" x2="11.5" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div style={divider} />

      {/* ── Language ─────────────────────────── */}
      <div style={sectionLabel}>{t('settings.language')}</div>

      <div style={{ position: 'relative' }}>
        <div style={row}>
          <span style={rowText}>{LANGUAGES[language] || language}</span>
          <button
            onClick={() => setShowLangList(v => !v)}
            title={t('settings.language')}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: `1px solid ${showLangList ? 'var(--border-strong)' : 'var(--border)'}`,
              background: showLangList ? 'var(--surface-hover)' : 'var(--surface)',
              color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { if (!showLangList) { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)' } }}
          >
            <GlobeIcon />
          </button>
        </div>

        {showLangList && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            marginBottom: '4px',
          }}>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                onClick={() => { onChangeLanguage(code); setShowLangList(false) }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: language === code ? 'var(--surface-hover)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: language === code ? 'var(--text)' : 'var(--text-secondary)',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.background = language === code ? 'var(--surface-hover)' : 'transparent' }}
              >
                <span>{name}</span>
                {language === code && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const sectionLabel = {
  fontFamily: 'var(--font-body)',
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  padding: '0px 8px 0px',
}

const row = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '4px 4px 4px 8px',
  borderRadius: '6px',
  minHeight: '40px',
}

const rowText = {
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
  color: 'var(--text)',
}

const divider = {
  height: '1px',
  background: 'var(--border)',
  margin: '4px 0 12px',
}

import React, { useState, useEffect } from 'react'
import { CATEGORY_ICON_MAP } from './Icons.jsx'
import { formatSize } from '../utils.js'
import SettingsPopup from './SettingsPopup.jsx'
import { useLang } from '../i18n/index.jsx'

const CATEGORY_KEYS = [
  { key: 'browsers',  labelKey: 'cat.browsers',  color: 'var(--text-secondary)' },
  { key: 'developer', labelKey: 'cat.developer', color: 'var(--text-secondary)' },
  { key: 'apps',      labelKey: 'cat.apps',      color: 'var(--text-secondary)' },
  { key: 'orphaned',  labelKey: 'cat.orphaned',  color: 'var(--text-secondary)' },
  { key: 'user',      labelKey: 'cat.user',      color: 'var(--text-secondary)' },
  { key: 'advanced',  labelKey: 'cat.advanced',  color: 'var(--danger)' },
]

const CAT_TO_IDS = {
  browsers:  ['chrome-cache', 'safari-cache', 'firefox-cache', 'arc-cache', 'brave-cache'],
  developer: ['npm-cache', 'yarn-cache', 'pnpm-store', 'homebrew-cache', 'xcode-derived', 'xcode-archives', 'ios-simulators'],
  apps:      ['slack-cache', 'spotify-cache', 'zoom-cache', 'vscode-cache', 'figma-cache', 'docker-data'],
  orphaned:  ['orphaned-scan'],
  user:      ['user-caches', 'user-logs', 'trash'],
  advanced:  ['system-caches', 'system-logs', 'temp-system'],
}

function ScytheLogo() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
      <defs>
        <linearGradient id="sl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF9500" />
        </linearGradient>
      </defs>
      <path
        d="M 6.5 3.5 C 6.5 3.5 13 4.5 13 8.5 C 13 12 6.5 12 6.5 14.5 C 6.5 17 12 17.5 12 17.5"
        stroke="url(#sl-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="13.5" y1="2" x2="7" y2="18" stroke="#888888" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6.5" />
      <line x1="8" y1="7" x2="8" y2="11" />
      <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function CategoryCheckbox({ checked }) {
  return (
    <div style={{
      width: '14px',
      height: '14px',
      borderRadius: '3px',
      border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--accent)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'background 0.12s, border-color 0.12s',
    }}>
      {checked && (
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
          <path d="M1 4L3.5 6.5L9 1" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

export default function Sidebar({
  appState,
  enabledCategories,
  estimates = {},
  scanProgress = {},
  scanResults = [],
  onCategoryToggle,
  onCategoryScroll,
  onNewScan,
  theme,
  onToggleTheme,
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
}) {
  const [showSettings, setShowSettings] = useState(false)
  const [openTooltip, setOpenTooltip] = useState(null)
  const [tooltipRect, setTooltipRect] = useState(null)
  const { t } = useLang()

  useEffect(() => {
    if (!openTooltip) return
    const close = () => { setOpenTooltip(null); setTooltipRect(null) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [openTooltip])

  return (
    <div style={{
      width: '240px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      position: 'relative',
      overflow: 'visible',
    }}>

      {/* Part 1: Logo */}
      <div style={{
        paddingTop: '52px',
        paddingBottom: '14px',
        paddingLeft: '16px',
        paddingRight: '12px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '14px',
          letterSpacing: '0.02em',
          color: 'var(--text)',
        }}>
          Scythe
        </span>

        {onNewScan && (
          <button
            onClick={onNewScan}
            style={{
              WebkitAppRegion: 'no-drag',
              marginLeft: 'auto',
              padding: '3px 9px',
              borderRadius: '5px',
              background: 'transparent',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            {t('sidebar.newScan')}
          </button>
        )}
      </div>

      {/* Part 2: Category widget */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 8px',
        WebkitAppRegion: 'no-drag',
      }}>
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '8px',
        }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            padding: '2px 8px 8px',
          }}>
            {t('sidebar.scanAreas')}
          </div>

          {CATEGORY_KEYS.map(({ key, labelKey, color }) => {
            const label = t(labelKey)
            const Icon = CATEGORY_ICON_MAP[key]
            const ids = CAT_TO_IDS[key] || []
            const isEnabled = enabledCategories[key]
            let rightNode = null
            let rowOpaque = true
            let estSize = 0

            if (appState === 'idle') {
              estSize = ids.reduce((sum, id) => sum + (estimates[id] || 0), 0)
              rowOpaque = isEnabled
            } else if (appState === 'scanning') {
              const statuses = ids.map(id => scanProgress[id]?.status).filter(Boolean)
              const isActive = statuses.some(s => s === 'scanning')
              const hasDone = statuses.some(s => s === 'done')
              rowOpaque = isActive || hasDone
              if (isActive) {
                rightNode = (
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: 'var(--accent)',
                    boxShadow: '0 0 6px rgba(255, 149, 0, 0.70)',
                    flexShrink: 0,
                  }} />
                )
              } else if (hasDone) {
                rightNode = (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )
              }
            } else {
              const catResults = scanResults.filter(r => ids.includes(r.id) || r.category === key)
              const totalSize = catResults.reduce((sum, r) => sum + (r.size || 0), 0)
              rowOpaque = catResults.some(r => r.exists)
              if (totalSize > 0) {
                rightNode = (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {formatSize(totalSize)}
                  </span>
                )
              }
            }

            return (
              <React.Fragment key={key}>
              {key === 'advanced' && (
                <div style={{ height: '1px', background: 'var(--border)', margin: '8px 4px' }} />
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '4px',
                opacity: rowOpaque ? 1 : 0.38,
              }}>

                {/* Main row */}
                <button
                  onClick={() => {
                    setOpenTooltip(null)
                    setTooltipRect(null)
                    if (appState === 'idle') onCategoryToggle(key)
                    else if (appState === 'results') onCategoryScroll(key)
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    cursor: appState === 'idle' || appState === 'results' ? 'pointer' : 'default',
                    transition: 'background 0.12s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <Icon size={18} color={rowOpaque ? (key === 'advanced' ? 'var(--danger)' : 'var(--text)') : 'var(--text-muted)'} />

                  {appState === 'idle' ? (
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        fontSize: '13px',
                        color: rowOpaque ? 'var(--text)' : 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {label}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '10px',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {t(`cat.${key}.desc`)}
                      </span>
                    </div>
                  ) : (
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      fontSize: '13px',
                      color: rowOpaque ? 'var(--text)' : 'var(--text-secondary)',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  )}

                  {appState === 'idle'
                    ? <CategoryCheckbox checked={!!isEnabled} />
                    : rightNode
                  }
                </button>

                {/* Info button — outside the row, far right */}
                {appState === 'idle' && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      if (openTooltip === key) {
                        setOpenTooltip(null)
                        setTooltipRect(null)
                        return
                      }
                      const rect = e.currentTarget.getBoundingClientRect()
                      setTooltipRect({ top: rect.bottom + 6, left: rect.left - 180, width: 196 })
                      setOpenTooltip(key)
                    }}
                    style={{
                      flexShrink: 0,
                      width: '24px',
                      height: '24px',
                      marginLeft: '3px',
                      borderRadius: '6px',
                      border: `1px solid ${openTooltip === key ? 'var(--border-strong)' : 'var(--border)'}`,
                      background: openTooltip === key ? 'var(--surface-hover)' : 'var(--bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: openTooltip === key ? 'var(--text-secondary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'background 0.12s, border-color 0.12s, color 0.12s',
                    }}
                    onMouseEnter={e => {
                      if (openTooltip !== key) {
                        e.currentTarget.style.background = 'var(--surface-hover)'
                        e.currentTarget.style.borderColor = 'var(--border-strong)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                      }
                    }}
                    onMouseLeave={e => {
                      if (openTooltip !== key) {
                        e.currentTarget.style.background = 'var(--bg-secondary)'
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text-muted)'
                      }
                    }}
                  >
                    <InfoIcon />
                  </button>
                )}

              </div>
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Part 3: Settings */}
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '8px',
        WebkitAppRegion: 'no-drag',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setShowSettings(v => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            border: 'none',
            background: showSettings ? 'var(--surface-hover)' : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.12s',
            color: 'var(--text-secondary)',
            textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)' }}
          onMouseLeave={e => { e.currentTarget.style.background = showSettings ? 'var(--surface-hover)' : 'transparent' }}
        >
          <SlidersIcon />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            {t('sidebar.settings')}
          </span>
        </button>
      </div>

      {openTooltip && tooltipRect && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: tooltipRect.top,
            left: tooltipRect.left,
            width: tooltipRect.width,
            zIndex: 300,
            background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px',
            padding: '9px 11px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.55,
          }}>
            {t(`cat.${openTooltip}.desc`)}
          </p>
        </div>
      )}

      {showSettings && (
        <SettingsPopup
          theme={theme}
          onToggleTheme={onToggleTheme}
          onClose={() => setShowSettings(false)}
          updateState={updateState}
          availableVersion={availableVersion}
          downloadProgress={downloadProgress}
          appVersion={appVersion}
          onCheckForUpdates={onCheckForUpdates}
          onDownloadAndInstall={onDownloadAndInstall}
          onRestart={onRestart}
          onQuit={onQuit}
          language={language}
          onChangeLanguage={onChangeLanguage}
        />
      )}
    </div>
  )
}

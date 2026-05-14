import React, { useState } from 'react'
import { CATEGORY_ICON_MAP } from './Icons.jsx'
import { formatSize } from '../utils.js'
import SettingsPopup from './SettingsPopup.jsx'

const CATEGORIES = [
  { key: 'user',      label: 'Cacher',       color: 'var(--text-secondary)' },
  { key: 'browsers',  label: 'Webbläsare',   color: 'var(--text-secondary)' },
  { key: 'developer', label: 'Utvecklare',   color: 'var(--text-secondary)' },
  { key: 'apps',      label: 'Appar',        color: 'var(--text-secondary)' },
  { key: 'advanced',  label: 'Avancerat',    color: 'var(--danger)' },
]

const CAT_TO_IDS = {
  user:      ['user-caches', 'user-logs', 'trash'],
  browsers:  ['chrome-cache', 'safari-cache', 'firefox-cache', 'arc-cache', 'brave-cache'],
  developer: ['npm-cache', 'yarn-cache', 'pnpm-store', 'homebrew-cache', 'xcode-derived', 'xcode-archives', 'ios-simulators'],
  apps:      ['slack-cache', 'spotify-cache', 'zoom-cache', 'vscode-cache', 'figma-cache', 'docker-data'],
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

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
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
  appVersion,
  onCheckForUpdates,
  onDownloadAndInstall,
  onRestart,
}) {
  const [showSettings, setShowSettings] = useState(false)

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
        paddingTop: '28px',
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
        <ScytheLogo />
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
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Ny scan
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
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            padding: '2px 8px 8px',
          }}>
            Kategorier
          </div>

          {CATEGORIES.map(({ key, label, color }) => {
            const Icon = CATEGORY_ICON_MAP[key]
            const ids = CAT_TO_IDS[key] || []
            const isEnabled = enabledCategories[key]
            let rightNode = null
            let rowOpaque = true

            if (appState === 'idle') {
              const est = ids.reduce((sum, id) => sum + (estimates[id] || 0), 0)
              rightNode = est > 0
                ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>~{formatSize(est)}</span>
                : null
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
              const catResults = scanResults.filter(r => ids.includes(r.id))
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
              <button
                key={key}
                onClick={() => {
                  if (appState === 'idle') onCategoryToggle(key)
                  else if (appState === 'results') onCategoryScroll(key)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  cursor: appState === 'idle' || appState === 'results' ? 'pointer' : 'default',
                  transition: 'background 0.12s',
                  opacity: rowOpaque ? 1 : 0.38,
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {appState === 'idle' ? (
                  <CategoryCheckbox checked={!!isEnabled} />
                ) : (
                  <Icon size={14} color={rowOpaque ? color : 'var(--text-muted)'} />
                )}

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

                {rightNode}
              </button>
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
          <GearIcon />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Inställningar
          </span>
        </button>
      </div>

      {showSettings && (
        <SettingsPopup
          theme={theme}
          onToggleTheme={onToggleTheme}
          onClose={() => setShowSettings(false)}
          updateState={updateState}
          appVersion={appVersion}
          onCheckForUpdates={onCheckForUpdates}
          onDownloadAndInstall={onDownloadAndInstall}
          onRestart={onRestart}
        />
      )}
    </div>
  )
}

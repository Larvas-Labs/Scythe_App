import React from 'react'
import { CATEGORY_ICON_MAP } from './Icons.jsx'
import StorageRing from './StorageRing.jsx'
import { formatSize } from '../utils.js'

const CATEGORY_LABELS = {
  user:      'Användarcacher',
  browsers:  'Webbläsare',
  developer: 'Utvecklarverktyg',
  apps:      'Appdata',
  advanced:  'Avancerat',
}

const CATEGORY_COLORS = {
  user:      'oklch(83% 0.245 152)',
  browsers:  'oklch(63% 0.244 257)',
  developer: 'oklch(68% 0.19 300)',
  apps:      'oklch(72% 0.17 60)',
  advanced:  'oklch(62% 0.247 22)',
}

const CAT_TO_IDS = {
  user:      ['user-caches', 'user-logs', 'trash'],
  browsers:  ['chrome-cache', 'safari-cache', 'firefox-cache', 'arc-cache', 'brave-cache'],
  developer: ['npm-cache', 'yarn-cache', 'pnpm-store', 'homebrew-cache', 'xcode-derived', 'xcode-archives', 'ios-simulators'],
  apps:      ['slack-cache', 'spotify-cache', 'zoom-cache', 'vscode-cache', 'figma-cache', 'docker-data'],
  advanced:  ['system-caches', 'system-logs', 'temp-system'],
}

export default function NavRail({
  appState,
  enabledCategories,
  scanProgress,
  scanResults,
  estimates = {},
  onCategoryClick,
  onStartScan,
  onAbortScan,
  totalFoundSize = 0,
  chosenSize = 0,
}) {
  const categories = Object.keys(CATEGORY_LABELS)

  return (
    <div
      style={{
        width: '200px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Category list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px 0' }}>
        <div className="label-xs" style={{ padding: '8px 8px 6px' }}>
          Kategorier
        </div>

        {categories.map(key => {
          const Icon = CATEGORY_ICON_MAP[key]
          const catColor = CATEGORY_COLORS[key]
          const ids = CAT_TO_IDS[key] || []

          let isEnabled = true
          let isActive = false
          let rightNode = null

          if (appState === 'idle') {
            isEnabled = enabledCategories[key]
          } else if (appState === 'scanning') {
            const statuses = ids.map(id => scanProgress[id]?.status).filter(Boolean)
            isActive = statuses.some(s => s === 'scanning')
            const hasDone = statuses.some(s => s === 'done')
            isEnabled = isActive || hasDone
            if (isActive) {
              rightNode = (
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--accent-green)',
                    boxShadow: '0 0 6px oklch(83% 0.245 152 / 0.7)',
                    flexShrink: 0,
                  }}
                />
              )
            } else if (hasDone) {
              rightNode = (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M2.5 7L5.5 10L11.5 4" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )
            }
          } else {
            // results / deleting / done
            const catResults = scanResults.filter(r => ids.includes(r.id))
            const totalSize = catResults.reduce((sum, r) => sum + (r.size || 0), 0)
            const hasResults = catResults.some(r => r.exists)
            isEnabled = hasResults
            if (totalSize > 0) {
              rightNode = (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
                  {formatSize(totalSize)}
                </span>
              )
            }
          }

          return (
            <button
              key={key}
              onClick={() => onCategoryClick(key)}
              title={CATEGORY_LABELS[key]}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--surface)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.15s',
                opacity: isEnabled ? 1 : 0.38,
                textAlign: 'left',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)' }}
              onMouseLeave={e => { e.currentTarget.style.background = isActive ? 'var(--surface)' : 'transparent' }}
            >
              <Icon size={15} color={isEnabled ? catColor : 'var(--text-muted)'} />

              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  color: isEnabled ? 'var(--text)' : 'var(--text-secondary)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {CATEGORY_LABELS[key]}
              </span>

              {appState === 'idle' ? (
                <div
                  className={`toggle-track ${isEnabled ? 'on' : ''}`}
                  style={{ pointerEvents: 'none', flexShrink: 0 }}
                >
                  <div className="toggle-thumb" />
                </div>
              ) : (
                rightNode
              )}
            </button>
          )
        })}
      </div>

      {/* Bottom section */}
      <div
        style={{
          padding: '8px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          alignItems: 'stretch',
        }}
      >
        {(appState === 'results' || appState === 'done') && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
            <StorageRing size={totalFoundSize} selectedSize={chosenSize} svgSize={140} />
          </div>
        )}

        {appState === 'idle' && (
          <button
            className="btn-primary"
            style={{ padding: '10px 16px', borderRadius: '10px', fontSize: '0.875rem' }}
            onClick={onStartScan}
          >
            Kör scanning
          </button>
        )}

        {appState === 'scanning' && (
          <button
            className="btn-ghost"
            style={{ padding: '9px 16px', borderRadius: '10px', fontSize: '0.82rem' }}
            onClick={onAbortScan}
          >
            Avbryt
          </button>
        )}
      </div>
    </div>
  )
}

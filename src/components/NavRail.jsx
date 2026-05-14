import React from 'react'
import { CATEGORY_ICON_MAP } from './Icons.jsx'

const CATEGORY_LABELS = {
  user:      'Användarcacher',
  browsers:  'Webbläsare',
  developer: 'Utvecklarverktyg',
  apps:      'Appdata',
  advanced:  'Avancerat',
}

const CAT_TO_IDS = {
  user:      ['user-caches', 'user-logs', 'trash'],
  browsers:  ['chrome-cache', 'safari-cache', 'firefox-cache', 'arc-cache', 'brave-cache'],
  developer: ['npm-cache', 'yarn-cache', 'pnpm-store', 'homebrew-cache', 'xcode-derived', 'xcode-archives', 'ios-simulators'],
  apps:      ['slack-cache', 'spotify-cache', 'zoom-cache', 'vscode-cache', 'figma-cache', 'docker-data'],
  advanced:  ['system-caches', 'system-logs', 'temp-system'],
}

function getIconColor(key, appState, enabledCategories, scanProgress, scanResults) {
  if (appState === 'idle') {
    return enabledCategories[key] ? 'var(--text)' : 'var(--text-muted)'
  }

  if (appState === 'scanning') {
    const ids = CAT_TO_IDS[key] || []
    const statuses = ids.map(id => scanProgress[id]?.status).filter(Boolean)
    const hasScanning = statuses.some(s => s === 'scanning')
    const hasDone = statuses.some(s => s === 'done')
    if (hasScanning) return 'var(--accent-green)'
    if (hasDone) return 'var(--text)'
    return 'var(--text-muted)'
  }

  if (appState === 'results' || appState === 'deleting' || appState === 'done') {
    const ids = CAT_TO_IDS[key] || []
    const hasResults = scanResults.some(r => ids.includes(r.id) && r.exists)
    return hasResults ? 'var(--text)' : 'var(--text-muted)'
  }

  return 'var(--text-muted)'
}

function isActiveItem(key, appState, scanProgress) {
  if (appState !== 'scanning') return false
  const ids = CAT_TO_IDS[key] || []
  return ids.some(id => scanProgress[id]?.status === 'scanning')
}

export default function NavRail({ appState, enabledCategories, scanProgress, scanResults, onCategoryClick }) {
  const categories = Object.keys(CATEGORY_LABELS)

  return (
    <div
      style={{
        width: '64px',
        flexShrink: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '16px',
        paddingBottom: '16px',
        gap: '4px',
        overflowY: 'auto',
      }}
    >
      {categories.map(key => {
        const Icon = CATEGORY_ICON_MAP[key]
        const iconColor = getIconColor(key, appState, enabledCategories, scanProgress, scanResults)
        const active = isActiveItem(key, appState, scanProgress)

        return (
          <button
            key={key}
            title={CATEGORY_LABELS[key]}
            onClick={() => onCategoryClick(key)}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              border: 'none',
              background: active ? 'var(--surface)' : 'transparent',
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
              position: 'relative',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!active) e.currentTarget.style.background = 'var(--surface-hover)'
            }}
            onMouseLeave={e => {
              if (!active) e.currentTarget.style.background = 'transparent'
            }}
          >
            <Icon size={20} color={iconColor} />
            {active && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  borderRadius: '2px 0 0 2px',
                  background: 'var(--accent-green)',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

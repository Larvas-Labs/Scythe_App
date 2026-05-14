import React from 'react'
import { formatSize } from '../utils.js'

const CATEGORY_ICONS = {
  user: '👤',
  browsers: '🌐',
  developer: '💻',
  apps: '📱',
  advanced: '⚙️',
}

const CATEGORY_TARGET_IDS = {
  user: ['user-caches', 'user-logs', 'trash'],
  browsers: ['chrome-cache', 'safari-cache', 'firefox-cache', 'arc-cache', 'brave-cache'],
  developer: ['npm-cache', 'yarn-cache', 'pnpm-store', 'homebrew-cache', 'xcode-derived', 'xcode-archives', 'ios-simulators'],
  apps: ['slack-cache', 'spotify-cache', 'zoom-cache', 'vscode-cache', 'figma-cache', 'docker-data'],
  advanced: ['system-caches', 'system-logs', 'temp-system'],
}

export default function CategoryToggle({ categoryKey, label, enabled, onToggle, estimates, isAdvanced }) {
  const ids = CATEGORY_TARGET_IDS[categoryKey] || []
  const totalEstimate = ids.reduce((sum, id) => sum + (estimates[id] || 0), 0)

  return (
    <div>
      {isAdvanced && (
        <div
          style={{
            borderTop: '1px solid var(--border-strong)',
            marginTop: '12px',
            marginBottom: '12px',
            paddingTop: '12px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 184, 0, 0.08)',
              border: '1px solid rgba(255, 184, 0, 0.25)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'var(--warning)',
                marginBottom: '2px',
              }}
            >
              ⚠️ Avancerat
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4,
              }}
            >
              Dessa åtgärder påverkar systemfiler och kräver administratörslösenord.
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: enabled ? 'var(--surface)' : 'transparent',
          border: `1px solid ${enabled ? 'var(--border)' : 'transparent'}`,
          transition: 'background 0.15s, border-color 0.15s',
          cursor: 'pointer',
        }}
        onClick={onToggle}
      >
        <div
          className={`toggle-track ${enabled ? 'on' : ''}`}
          style={{ pointerEvents: 'none' }}
        >
          <div className="toggle-thumb" />
        </div>

        <span style={{ fontSize: '1.1rem' }}>{CATEGORY_ICONS[categoryKey]}</span>

        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '0.9rem',
            color: enabled ? 'var(--text)' : 'var(--text-muted)',
            flex: 1,
            transition: 'color 0.15s',
          }}
        >
          {label}
        </span>

        {totalEstimate > 0 && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            ~{formatSize(totalEstimate)}
          </span>
        )}
      </div>
    </div>
  )
}

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
        <div style={{ marginTop: '16px', marginBottom: '8px' }}>
          <div
            style={{
              background: 'oklch(62% 0.247 22 / 0.07)',
              border: '1px solid oklch(62% 0.247 22 / 0.22)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '8px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.78rem', color: 'var(--danger)', marginBottom: '2px' }}>
              ⚠️ Avancerat — Systemfiler
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
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
          padding: '11px 14px',
          borderRadius: '10px',
          background: enabled ? 'var(--surface)' : 'transparent',
          border: `1px solid ${enabled ? 'var(--border)' : 'var(--border)'}`,
          opacity: enabled ? 1 : 0.55,
          transition: 'background 0.15s, opacity 0.15s',
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

        <span style={{ fontSize: '1rem' }}>{CATEGORY_ICONS[categoryKey]}</span>

        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '0.875rem',
            color: enabled ? 'var(--text)' : 'var(--text-secondary)',
            flex: 1,
            transition: 'color 0.15s',
          }}
        >
          {label}
        </span>

        {totalEstimate > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: enabled ? 'var(--text-secondary)' : 'var(--text-muted)',
            }}
          >
            ~{formatSize(totalEstimate)}
          </span>
        )}
      </div>
    </div>
  )
}

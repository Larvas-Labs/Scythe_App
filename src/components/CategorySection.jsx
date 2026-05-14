import React from 'react'
import { formatSize, cn } from '../utils.js'
import ScanItem from './ScanItem.jsx'

const CATEGORY_LABELS = {
  user: 'Användarcacher',
  browsers: 'Webbläsare',
  developer: 'Utvecklarverktyg',
  apps: 'Appdata',
  advanced: 'Avancerat',
}

const CATEGORY_COLORS = {
  user:      'oklch(80% 0.18 155)',
  browsers:  'oklch(61% 0.20 260)',
  developer: 'oklch(68% 0.19 300)',
  apps:      'oklch(72% 0.17 60)',
  advanced:  'oklch(60% 0.22 25)',
}

export default function CategorySection({ category, results, selectedIds, onToggleItem, onToggleCategory }) {
  const existing = results.filter(r => r.exists)
  const allSelected = existing.length > 0 && existing.every(r => selectedIds.has(r.id))
  const someSelected = existing.some(r => selectedIds.has(r.id))
  const totalSize = results.reduce((sum, r) => sum + (r.size || 0), 0)
  const isAdvanced = category === 'advanced'

  return (
    <div style={{ marginBottom: '8px' }}>
      {isAdvanced && (
        <div
          style={{
            margin: '16px 16px 12px',
            padding: '10px 14px',
            background: 'rgba(255, 69, 58, 0.08)',
            border: '1px solid rgba(255, 69, 58, 0.2)',
            borderRadius: '8px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--danger)', marginBottom: '2px' }}>
            ⚠️ Avancerat — Systemfiler
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Dessa åtgärder påverkar systemfiler och kräver administratörslösenord.
          </div>
        </div>
      )}

      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 16px',
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          className={cn('s-checkbox', allSelected && 'checked', !allSelected && someSelected && 'indeterminate')}
          onClick={() => onToggleCategory(category)}
          style={{ cursor: 'pointer' }}
        >
          {allSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {!allSelected && someSelected && (
            <div style={{ width: '6px', height: '2px', background: '#fff', borderRadius: '1px' }} />
          )}
        </div>

        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: CATEGORY_COLORS[category], flexShrink: 0 }} />

        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)', flex: 1 }}>
          {CATEGORY_LABELS[category] || category}
        </span>

        {totalSize > 0 && (
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {formatSize(totalSize)}
          </span>
        )}
      </div>

      <div style={{ paddingTop: '4px' }}>
        {results
          .slice()
          .sort((a, b) => (b.size || 0) - (a.size || 0))
          .map(result => (
            <ScanItem
              key={result.id}
              result={result}
              selected={selectedIds.has(result.id)}
              onToggle={onToggleItem}
            />
          ))}
      </div>
    </div>
  )
}

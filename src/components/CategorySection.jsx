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
  user:      'oklch(83% 0.245 152)',
  browsers:  'oklch(63% 0.244 257)',
  developer: 'oklch(68% 0.19 300)',
  apps:      'oklch(72% 0.17 60)',
  advanced:  'oklch(62% 0.247 22)',
}

export default function CategorySection({ category, results, selectedIds, onToggleItem, onToggleCategory }) {
  const existing = results.filter(r => r.exists)
  const allSelected = existing.length > 0 && existing.every(r => selectedIds.has(r.id))
  const someSelected = existing.some(r => selectedIds.has(r.id))
  const totalSize = results.reduce((sum, r) => sum + (r.size || 0), 0)
  const isAdvanced = category === 'advanced'

  return (
    <div style={{ marginBottom: '12px' }}>
      {isAdvanced && (
        <div
          style={{
            margin: '8px 16px 8px',
            padding: '10px 14px',
            background: 'oklch(62% 0.247 22 / 0.07)',
            border: '1px solid oklch(62% 0.247 22 / 0.2)',
            borderRadius: '10px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.78rem', color: 'var(--danger)', marginBottom: '2px' }}>
            ⚠️ Avancerat — Systemfiler
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            Dessa åtgärder påverkar systemfiler och kräver administratörslösenord.
          </div>
        </div>
      )}

      {/* Section card: sticky header + items as a unified card */}
      <div className="section-card" style={{ margin: '0 16px' }}>
        {/* Sticky header inside card */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: 'var(--surface)',
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

          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: CATEGORY_COLORS[category], flexShrink: 0 }} />

          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)', flex: 1 }}>
            {CATEGORY_LABELS[category] || category}
          </span>

          {totalSize > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {formatSize(totalSize)}
            </span>
          )}
        </div>

        {/* Items */}
        <div>
          {results
            .slice()
            .sort((a, b) => (b.size || 0) - (a.size || 0))
            .map((result, i, arr) => (
              <ScanItem
                key={result.id}
                result={result}
                selected={selectedIds.has(result.id)}
                onToggle={onToggleItem}
                isLast={i === arr.length - 1}
              />
            ))}
        </div>
      </div>
    </div>
  )
}

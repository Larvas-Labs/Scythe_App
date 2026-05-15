import React from 'react'
import { formatSize, cn } from '../utils.js'
import ScanItem from './ScanItem.jsx'
import { CATEGORY_ICON_MAP } from './Icons.jsx'
import { useLang } from '../i18n/index.jsx'

const CATEGORY_LABEL_KEYS = {
  user: 'cat.user',
  browsers: 'cat.browsers',
  developer: 'cat.developer',
  apps: 'cat.apps',
  advanced: 'cat.advanced',
}

const CATEGORY_COLORS = {
  user:      'var(--text-secondary)',
  browsers:  'var(--text-secondary)',
  developer: 'var(--text-secondary)',
  apps:      'var(--text-secondary)',
  advanced:  'var(--danger)',
}

export default function CategorySection({ category, results, selectedIds, onToggleItem, onToggleCategory }) {
  const { t } = useLang()
  const existing = results.filter(r => r.exists)
  const allSelected = existing.length > 0 && existing.every(r => selectedIds.has(r.id))
  const someSelected = existing.some(r => selectedIds.has(r.id))
  const totalSize = results.reduce((sum, r) => sum + (r.size || 0), 0)
  const isAdvanced = category === 'advanced'
  const CatIcon = CATEGORY_ICON_MAP[category]

  return (
    <div id={'cat-' + category} style={{ marginBottom: '16px' }}>
      {isAdvanced && (
        <div
          style={{
            margin: '8px 16px 8px',
            padding: '10px 14px',
            background: 'rgba(255, 69, 58, 0.07)',
            border: '1px solid rgba(255, 69, 58, 0.20)',
            borderRadius: '10px',
          }}
        >
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.78rem', color: 'var(--danger)', marginBottom: '2px' }}>
            {t('section.advanced.title')}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
            {t('section.advanced.desc')}
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

          {CatIcon && <CatIcon size={14} color={CATEGORY_COLORS[category]} />}

          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)', flex: 1 }}>
            {t(CATEGORY_LABEL_KEYS[category] || category)}
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
            .filter(r => r.exists)
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

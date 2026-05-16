import React, { useState } from 'react'
import { formatSize, cn } from '../utils.js'
import ScanItem from './ScanItem.jsx'
import { CATEGORY_ICON_MAP } from './Icons.jsx'
import { useLang } from '../i18n/index.jsx'

const CATEGORY_LABEL_KEYS = {
  user: 'cat.user',
  browsers: 'cat.browsers',
  developer: 'cat.developer',
  apps: 'cat.apps',
  orphaned: 'cat.orphaned',
  advanced: 'cat.advanced',
}

const CATEGORY_COLORS = {
  user:      'var(--text-secondary)',
  browsers:  'var(--text-secondary)',
  developer: 'var(--text-secondary)',
  apps:      'var(--text-secondary)',
  orphaned:  'var(--text-secondary)',
  advanced:  'var(--danger)',
}

function ChevronIcon({ collapsed }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease', flexShrink: 0 }}
    >
      <path d="M3 5l4 4 4-4" />
    </svg>
  )
}

export default function CategorySection({ category, results, selectedIds, onToggleItem, onToggleCategory }) {
  const { t } = useLang()
  const [collapsed, setCollapsed] = useState(false)

  const existing = results.filter(r => r.exists)
  const allSelected = existing.length > 0 && existing.every(r => selectedIds.has(r.id))
  const someSelected = existing.some(r => selectedIds.has(r.id))
  const totalSize = results.reduce((sum, r) => sum + (r.size || 0), 0)
  const isAdvanced = category === 'advanced'
  const isOrphaned = category === 'orphaned'
  const CatIcon = CATEGORY_ICON_MAP[category]

  const cardStyle = isAdvanced ? {
    background: 'rgba(255, 69, 58, 0.06)',
    border: '1px solid rgba(255, 69, 58, 0.28)',
    boxShadow: '0 4px 24px rgba(255, 69, 58, 0.10)',
  } : isOrphaned ? {
    background: 'rgba(255, 149, 0, 0.04)',
    border: '1px solid rgba(255, 149, 0, 0.22)',
  } : {}

  // Per-category description colors
  const descTitleColor = isAdvanced ? 'var(--danger)' : isOrphaned ? 'var(--warning)' : 'var(--text-secondary)'
  const descBorderColor = isAdvanced ? 'rgba(255, 69, 58, 0.20)' : isOrphaned ? 'rgba(255, 149, 0, 0.18)' : 'var(--border)'

  const stickyBg = isAdvanced
    ? 'rgba(40, 10, 8, 0.95)'
    : isOrphaned
      ? 'rgba(30, 20, 5, 0.95)'
      : 'var(--surface)'

  const stickyBorder = isAdvanced
    ? 'rgba(255, 69, 58, 0.18)'
    : isOrphaned
      ? 'rgba(255, 149, 0, 0.15)'
      : 'var(--border)'

  return (
    <div id={'cat-' + category} style={{ marginBottom: '16px' }}>
      <div className="section-card" style={{ margin: '0 16px', ...cardStyle }}>

        {/* Sticky header */}
        <div
          onClick={() => setCollapsed(v => !v)}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            background: stickyBg,
            borderBottom: collapsed ? 'none' : `1px solid ${stickyBorder}`,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            className={cn('s-checkbox', allSelected && 'checked', !allSelected && someSelected && 'indeterminate')}
            onClick={e => { e.stopPropagation(); onToggleCategory(category) }}
            style={{ cursor: 'pointer', flexShrink: 0 }}
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

          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.8rem', color: isAdvanced ? 'var(--danger)' : 'var(--text)', flex: 1 }}>
            {t(CATEGORY_LABEL_KEYS[category] || category)}
          </span>

          {totalSize > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 500, color: isAdvanced ? 'rgba(255,69,58,0.8)' : 'var(--text-secondary)' }}>
              {formatSize(totalSize)}
            </span>
          )}

          <ChevronIcon collapsed={collapsed} />
        </div>

        {/* Collapsible content */}
        <div style={{
          display: 'grid',
          gridTemplateRows: collapsed ? '0fr' : '1fr',
          transition: 'grid-template-rows 0.22s ease',
        }}>
          <div style={{ overflow: 'hidden' }}>

            {/* Description block — all categories */}
            <div style={{
              padding: '10px 14px',
              borderBottom: `1px solid ${descBorderColor}`,
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {t(`cat.${category}.desc`)}
              </div>
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

      </div>
    </div>
  )
}

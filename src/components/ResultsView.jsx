import React, { useState, useCallback, useMemo } from 'react'
import StorageRing from './StorageRing.jsx'
import ResultList from './ResultList.jsx'
import { IconSearch } from './Icons.jsx'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

function matchesQuery(result, query, t) {
  const q = query.toLowerCase()
  const name = (result.nameKey ? t(result.nameKey) : result.name || '').toLowerCase()
  const desc = (result.descKey ? t(result.descKey) : result.description || '').toLowerCase()
  const path = (result.path || '').toLowerCase()
  return name.includes(q) || desc.includes(q) || path.includes(q)
}

export default function ResultsView({
  scanResults,
  selectedIds,
  totalFoundSize,
  chosenSize,
  onToggleItem,
  onToggleCategory,
  onDeselectItems,
}) {
  const { t } = useLang()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return scanResults
    return scanResults.filter(r => matchesQuery(r, searchQuery, t))
  }, [scanResults, searchQuery, t])

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value)
    const q = value.trim().toLowerCase()
    if (q) {
      const toDeselect = scanResults
        .filter(r => selectedIds.has(r.id) && !matchesQuery(r, q, t))
        .map(r => r.id)
      if (toDeselect.length > 0) onDeselectItems(toDeselect)
    }
  }, [scanResults, selectedIds, t, onDeselectItems])

  const selectionFraction = totalFoundSize > 0 ? chosenSize / totalFoundSize : 0
  const itemCount = scanResults.filter(r => selectedIds.has(r.id)).length
  const totalCount = scanResults.filter(r => r.exists).length
  const isFiltering = searchQuery.trim().length > 0
  const filteredExistCount = filteredResults.filter(r => r.exists).length

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── Summary widget ── */}
      <div style={{
        flexShrink: 0,
        margin: '16px 16px 0',
        background: 'rgba(255, 149, 0, 0.06)',
        border: '1px solid rgba(255, 149, 0, 0.18)',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '28px',
      }}>
        {/* Ring */}
        <StorageRing
          size={totalFoundSize}
          selectedSize={chosenSize}
          centerValue={chosenSize}
          centerLabel={t('results.selectedToClean')}
          svgSize={130}
          showLegend={false}
        />

        {/* Vertical divider */}
        <div style={{ width: '1px', alignSelf: 'stretch', background: 'var(--border)', flexShrink: 0 }} />

        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Numbers row */}
          <div style={{ display: 'flex', gap: '32px' }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                fontSize: '1.4rem',
                color: 'var(--text)',
                lineHeight: 1,
              }}>
                {formatSize(totalFoundSize)}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                marginTop: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {t('results.found')}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '1.4rem',
                color: 'var(--accent)',
                lineHeight: 1,
              }}>
                {formatSize(chosenSize)}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                marginTop: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {t('results.selectedToClean')}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 500,
                fontSize: '1.4rem',
                color: 'var(--text-secondary)',
                lineHeight: 1,
              }}>
                {itemCount}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{totalCount}</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                marginTop: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {t('results.items')}
              </div>
            </div>
          </div>

          {/* Selection progress bar */}
          <div>
            <div style={{
              width: '100%',
              height: '4px',
              background: 'var(--border)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${selectionFraction * 100}%`,
                background: 'var(--accent)',
                borderRadius: '2px',
                transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 0 8px rgba(255,149,0,0.5)',
              }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
              marginTop: '5px',
            }}>
              {t('results.percentSelected', { n: Math.round(selectionFraction * 100) })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ flexShrink: 0, margin: '12px 16px 0', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 11,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}>
          <IconSearch size={14} color={isFiltering ? 'var(--accent)' : 'var(--text-muted)'} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder={t('results.searchPlaceholder')}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 2px rgba(255,149,0,0.12)' }}
          onBlur={e => { e.target.style.borderColor = isFiltering ? 'rgba(255,149,0,0.4)' : 'var(--border)'; e.target.style.boxShadow = 'none' }}
          style={{
            width: '100%',
            padding: '8px 34px 8px 32px',
            background: 'var(--surface)',
            border: `1px solid ${isFiltering ? 'rgba(255,149,0,0.4)' : 'var(--border)'}`,
            borderRadius: '8px',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.83rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
        {isFiltering && (
          <button
            onClick={() => handleSearchChange('')}
            title="Clear search"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '1rem',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ×
          </button>
        )}
      </div>

      {/* ── Search status line ── */}
      {isFiltering && (
        <div style={{
          flexShrink: 0,
          margin: '6px 16px 0',
          fontFamily: 'var(--font-body)',
          fontSize: '0.72rem',
          color: filteredExistCount === 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
        }}>
          {filteredExistCount === 0
            ? t('results.searchNoResults')
            : t('results.searchCount', { n: filteredExistCount, total: totalCount })}
        </div>
      )}

      {/* ── Result list — direkt mot bakgrunden ── */}
      <div style={{ flex: 1, overflowY: 'auto', marginTop: '12px' }}>
        <ResultList
          results={filteredResults}
          selectedIds={selectedIds}
          onToggleItem={onToggleItem}
          onToggleCategory={onToggleCategory}
        />
      </div>

    </div>
  )
}

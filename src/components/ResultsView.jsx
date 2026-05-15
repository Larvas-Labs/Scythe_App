import React from 'react'
import StorageRing from './StorageRing.jsx'
import ResultList from './ResultList.jsx'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

export default function ResultsView({
  scanResults,
  selectedIds,
  totalFoundSize,
  chosenSize,
  onToggleItem,
  onToggleCategory,
}) {
  const { t } = useLang()
  const selectionFraction = totalFoundSize > 0 ? chosenSize / totalFoundSize : 0
  const itemCount = scanResults.filter(r => selectedIds.has(r.id)).length
  const totalCount = scanResults.filter(r => r.exists).length

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
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
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

      {/* ── Full-width result list ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        margin: '12px 16px 0',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px 12px 0 0',
      }}>
        <ResultList
          results={scanResults}
          selectedIds={selectedIds}
          onToggleItem={onToggleItem}
          onToggleCategory={onToggleCategory}
        />
      </div>

    </div>
  )
}

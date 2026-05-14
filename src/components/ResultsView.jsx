import React from 'react'
import StorageRing from './StorageRing.jsx'
import ResultList from './ResultList.jsx'
import { formatSize } from '../utils.js'

export default function ResultsView({
  scanResults,
  selectedIds,
  totalFoundSize,
  chosenSize,
  onToggleItem,
  onToggleCategory,
}) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      gap: '8px',
      padding: '16px',
      overflow: 'hidden',
    }}>
      {/* StorageRing widget — sticky left panel */}
      <div style={{
        width: '200px',
        flexShrink: 0,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px 16px',
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <StorageRing
          size={totalFoundSize}
          selectedSize={chosenSize}
          svgSize={160}
        />

        <div style={{ height: '1px', background: 'var(--border)' }} />

        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            fontSize: '18px',
            color: 'var(--accent)',
            lineHeight: 1.1,
          }}>
            {formatSize(chosenSize)}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            marginTop: '3px',
          }}>
            valt att rensa
          </div>
        </div>
      </div>

      {/* ResultList widget */}
      <div style={{
        flex: 1,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ResultList
            results={scanResults}
            selectedIds={selectedIds}
            onToggleItem={onToggleItem}
            onToggleCategory={onToggleCategory}
          />
        </div>
      </div>
    </div>
  )
}

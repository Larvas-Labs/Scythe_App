import React from 'react'
import IdleView from './IdleView.jsx'
import ScanView from './ScanView.jsx'
import ResultsView from './ResultsView.jsx'
import DoneView from './DoneView.jsx'
import { useLang } from '../i18n/index.jsx'

export default function MainContent({
  appState,
  scanResults,
  scanProgress,
  selectedIds,
  totalFoundSize,
  chosenSize,
  deleteResult,
  deleteProgress,
  totalEstimate,
  maxEstimate,
  onStartScan,
  onToggleItem,
  onToggleCategory,
  onDeselectItems,
  onAbortScan,
  onNewScan,
}) {
  const { t } = useLang()
  const scanItems = Object.values(scanProgress)
  const completedCount = scanItems.filter(i => i.status === 'done').length
  const totalCount = scanItems.length

  if (appState === 'idle') {
    return <IdleView onStartScan={onStartScan} totalEstimate={totalEstimate} maxEstimate={maxEstimate} />
  }

  if (appState === 'scanning') {
    return (
      <ScanView
        progress={scanProgress}
        completedCount={completedCount}
        totalCount={totalCount}
        onAbort={onAbortScan}
      />
    )
  }

  if (appState === 'results') {
    return (
      <ResultsView
        scanResults={scanResults}
        selectedIds={selectedIds}
        totalFoundSize={totalFoundSize}
        chosenSize={chosenSize}
        onToggleItem={onToggleItem}
        onToggleCategory={onToggleCategory}
        onDeselectItems={onDeselectItems}
      />
    )
  }

  if (appState === 'deleting') {
    const doneItems = (deleteProgress || []).filter(i => i.success)
    const currentItem = (deleteProgress || []).slice(-1)[0]
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '40px 36px',
          textAlign: 'center',
          width: '340px',
        }}>
          {/* Spinner */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                 style={{ animation: 'spin 0.9s linear infinite' }}>
              <circle cx="18" cy="18" r="14" stroke="var(--border-strong)"
                      strokeWidth="3" fill="none" />
              <path d="M18 4 A14 14 0 0 1 32 18" stroke="var(--accent)"
                    strokeWidth="3" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Title */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '20px',
            color: 'var(--text)',
            marginBottom: '6px',
          }}>
            {t('deleting.title')}
          </div>

          {/* Current item */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '0 0 20px',
            minHeight: '18px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {currentItem ? currentItem.name : t('deleting.subtitle')}
          </p>

          {/* Completed items list */}
          {doneItems.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              maxHeight: '120px',
              overflowY: 'auto',
              textAlign: 'left',
            }}>
              {doneItems.map(item => (
                <div key={item.path} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--bg-secondary)',
                  animation: 'scan-item-enter 0.25s ease-out both',
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M1 4L3.5 6.5L9 1" stroke="var(--accent)"
                          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (appState === 'done') {
    return <DoneView deleteResult={deleteResult} onNewScan={onNewScan} />
  }

  return null
}

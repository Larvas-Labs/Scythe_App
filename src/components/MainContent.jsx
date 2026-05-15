import React from 'react'
import IdleView from './IdleView.jsx'
import ScanProgress from './ScanProgress.jsx'
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
  onStartScan,
  onToggleItem,
  onToggleCategory,
  onAbortScan,
  onNewScan,
}) {
  const { t } = useLang()
  const scanItems = Object.values(scanProgress)
  const completedCount = scanItems.filter(i => i.status === 'done').length
  const totalCount = scanItems.length

  if (appState === 'idle') {
    return <IdleView onStartScan={onStartScan} />
  }

  if (appState === 'scanning') {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '32px',
          width: '100%',
          maxWidth: '520px',
        }}>
          <ScanProgress
            progress={scanProgress}
            completedCount={completedCount}
            totalCount={totalCount}
            onAbort={onAbortScan}
          />
        </div>
      </div>
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
      />
    )
  }

  if (appState === 'deleting') {
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
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '22px',
            color: 'var(--text)',
            marginBottom: '8px',
          }}>
            {t('deleting.title')}
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            {t('deleting.subtitle')}
          </p>
        </div>
      </div>
    )
  }

  if (appState === 'done') {
    return <DoneView deleteResult={deleteResult} onNewScan={onNewScan} />
  }

  return null
}

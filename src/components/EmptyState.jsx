import React from 'react'

export default function EmptyState({ onStartScan, appState = 'idle', currentScanItem, completedCount, totalCount }) {
  const isScanning = appState === 'scanning'
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-col items-center text-center" style={{ gap: '24px' }}>
      {!isScanning && (
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.6rem',
              marginBottom: '0.4rem',
              color: 'var(--text)',
            }}
          >
            Ready to harvest
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              maxWidth: '240px',
              lineHeight: 1.6,
              margin: '0 auto',
            }}
          >
            Välj kategorier och kör en scanning för att hitta filer som kan rensas
          </p>
        </div>
      )}

      {/* Scan button */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Pulsing rings during scan */}
        {isScanning && (
          <>
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '56px',
              borderRadius: '16px',
              background: 'oklch(83% 0.245 152 / 0.2)',
              animation: 'scan-pulse-ring 1.8s ease-out infinite',
            }} />
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '56px',
              borderRadius: '16px',
              background: 'oklch(83% 0.245 152 / 0.15)',
              animation: 'scan-pulse-ring 1.8s ease-out 0.6s infinite',
            }} />
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '56px',
              borderRadius: '16px',
              background: 'oklch(83% 0.245 152 / 0.1)',
              animation: 'scan-pulse-ring 1.8s ease-out 1.2s infinite',
            }} />
          </>
        )}

        <button
          onClick={isScanning ? undefined : onStartScan}
          style={{
            width: '180px',
            height: '52px',
            borderRadius: '14px',
            background: 'var(--accent)',
            border: 'none',
            cursor: isScanning ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            animation: isScanning ? 'scan-breathe 2s ease-in-out infinite' : undefined,
            transition: 'transform 0.15s, opacity 0.15s',
          }}
          onMouseEnter={e => { if (!isScanning) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { if (!isScanning) e.currentTarget.style.opacity = '1' }}
          onMouseDown={e => { if (!isScanning) e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={e => { if (!isScanning) e.currentTarget.style.transform = 'scale(1)' }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.9rem',
            color: 'oklch(5% 0.014 280)',
            letterSpacing: '0.02em',
          }}>
            {isScanning ? 'Skannar...' : 'Kör scanning'}
          </span>
        </button>
      </div>

      {/* Scanning status */}
      {isScanning && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '220px' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)', minHeight: '20px' }}>
            {currentScanItem ? `Skannar ${currentScanItem}...` : 'Förbereder...'}
          </div>
          <div style={{ width: '100%', height: '4px', background: 'var(--surface)', borderRadius: '2px', overflow: 'hidden' }}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {completedCount} av {totalCount} kategorier
          </div>
        </div>
      )}
    </div>
  )
}

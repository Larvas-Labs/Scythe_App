import React, { useRef, useMemo } from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

function SpinnerIcon({ size = 15 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 15 15" fill="none"
      style={{ animation: 'scan-spin 0.7s linear infinite', display: 'block', flexShrink: 0 }}
    >
      <circle cx="7.5" cy="7.5" r="5.5" stroke="var(--border-strong)" strokeWidth="1.6" />
      <path
        d="M7.5 2A5.5 5.5 0 0 1 13 7.5"
        stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon({ size = 15 }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 15 15" fill="none"
      stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: 'scan-tick 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both', display: 'block', flexShrink: 0 }}
    >
      <polyline points="2.5,7.5 6,11 12.5,4" />
    </svg>
  )
}

function PendingDot({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 15 15" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="7.5" cy="7.5" r="2" fill="var(--border-strong)" />
    </svg>
  )
}

export default function ScanProgress({ progress, completedCount, totalCount, onAbort }) {
  const { t } = useLang()
  const seenIds = useRef(new Set())
  const listRef = useRef(null)

  const items = useMemo(() => Object.values(progress), [progress])
  const currentItem = items.find(i => i.status === 'scanning')
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const foundSoFar = items.filter(i => i.status === 'done').reduce((s, i) => s + (i.size || 0), 0)

  return (
    <div style={{ maxWidth: '500px', width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.35rem',
          color: 'var(--text)',
          margin: '0 0 6px',
        }}>
          {t('scan.title')}
        </h2>

        {/* Current item — animated key swap causes fade re-render */}
        <div style={{ minHeight: '20px' }}>
          {currentItem ? (
            <p
              key={currentItem.id}
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                margin: 0,
                animation: 'scan-item-enter 0.25s ease-out both',
              }}
            >
              {t('scan.scanning', { name: currentItem.name })}
            </p>
          ) : items.length === 0 ? (
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              margin: 0,
            }}>
              {t('scan.title')}...
            </p>
          ) : null}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '5px',
        background: 'var(--bg-secondary)',
        borderRadius: '3px',
        marginBottom: '6px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Fill */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: `${progressPercent}%`,
          background: 'var(--accent)',
          borderRadius: '3px',
          transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }} />
        {/* Shimmer sweep */}
        {progressPercent > 0 && progressPercent < 100 && (
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${progressPercent}%`,
            overflow: 'hidden',
            borderRadius: '3px',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
              animation: 'scan-shimmer 1.6s ease-in-out infinite',
            }} />
          </div>
        )}
      </div>

      {/* Progress counters */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}>
          {t('scan.progress', { done: completedCount, total: totalCount })}
        </span>
        {foundSoFar > 0 && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--accent)',
            animation: 'scan-size-in 0.3s ease-out both',
          }}>
            {formatSize(foundSoFar)} {t('scan.found') || 'hittade'}
          </span>
        )}
      </div>

      {/* Item list */}
      <div
        ref={listRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          maxHeight: '280px',
          overflowY: 'auto',
          paddingRight: '2px',
        }}
      >
        {items.map((item, idx) => {
          const isNew = !seenIds.current.has(item.id)
          if (isNew) seenIds.current.add(item.id)

          const isActive = item.status === 'scanning'
          const isDone   = item.status === 'done'

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                background: isActive ? 'var(--surface-hover)' : 'var(--surface)',
                border: `1px solid ${isActive ? 'var(--border-strong)' : 'var(--border)'}`,
                opacity: !isDone && !isActive ? 0.45 : 1,
                transition: 'opacity 0.3s ease, background 0.2s ease, border-color 0.2s ease',
                animation: isNew ? `scan-item-enter 0.3s ease-out ${Math.min(idx, 6) * 30}ms both` : 'none',
              }}
            >
              {/* Status icon */}
              {isDone  && <CheckIcon size={14} />}
              {isActive && <SpinnerIcon size={14} />}
              {!isDone && !isActive && <PendingDot size={14} />}

              {/* Name */}
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: isDone ? 'var(--text)' : isActive ? 'var(--text)' : 'var(--text-secondary)',
                flex: 1,
                fontStyle: isActive ? 'italic' : 'normal',
                transition: 'color 0.2s ease',
              }}>
                {item.name}
              </span>

              {/* Size – animates in when done */}
              {isDone && item.size > 0 && (
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--accent)',
                  animation: 'scan-size-in 0.3s ease-out both',
                }}>
                  {formatSize(item.size)}
                </span>
              )}
              {isDone && item.size === 0 && (
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                }}>
                  tom
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Abort */}
      <button
        className="btn-ghost"
        onClick={onAbort}
        style={{
          marginTop: '20px',
          padding: '9px 22px',
          borderRadius: '8px',
          fontSize: '0.82rem',
        }}
      >
        {t('scan.abort')}
      </button>
    </div>
  )
}

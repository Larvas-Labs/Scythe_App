import React, { useEffect, useId, useRef, useState } from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

const SVG_SIZE  = 220
const RADIUS    = 88
const STROKE    = 10
const CIRC      = 2 * Math.PI * RADIUS
const cx = 110, cy = 110
const INNER_D   = (RADIUS - STROKE / 2) * 2  // 166px

function RingDone({ animate, glowId }) {
  return (
    <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
         style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <circle cx={cx} cy={cy} r={RADIUS} fill="none"
              stroke="var(--border)" strokeWidth={STROKE} />

      {/* Full ring — animates in on mount */}
      <circle cx={cx} cy={cy} r={RADIUS} fill="none"
              stroke="var(--accent)" strokeWidth={STROKE}
              strokeLinecap="butt"
              strokeDasharray={`${animate ? CIRC : 0} ${CIRC}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              filter={`url(#${glowId})`}
              style={{
                transition: animate
                  ? 'stroke-dasharray 0.75s cubic-bezier(0.16,1,0.3,1)'
                  : 'none',
                opacity: 0.85,
              }} />

      {/* Subtle emanating pulse — signals completion */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'scan-emanate 3s ease-out 0.8s infinite' }}>
        <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                stroke="var(--accent)" strokeWidth={1.5} />
      </g>
    </svg>
  )
}

function CenterCheck({ visible }) {
  // Draw-on animation via stroke-dashoffset
  // Path length: (3,21)→(18,36) = 15√2 ≈ 21.2, (18,36)→(51,3) = 33√2 ≈ 46.7 → total ≈ 68
  const PATH_LEN = 68
  return (
    <svg width={54} height={42} viewBox="0 0 54 42" fill="none"
         style={{ display: 'block' }}>
      <path
        d="M3 21L18 36L51 3"
        stroke="var(--accent)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={PATH_LEN}
        strokeDashoffset={visible ? 0 : PATH_LEN}
        style={{
          transition: visible
            ? 'stroke-dashoffset 0.55s cubic-bezier(0.16,1,0.3,1) 0.7s'
            : 'none',
        }}
      />
    </svg>
  )
}

function RowCheck() {
  return (
    <svg width={11} height={11} viewBox="0 0 14 14" fill="none"
         stroke="var(--accent)" strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0, display: 'block' }}>
      <polyline points="2.5,7.5 6,11 12.5,4" />
    </svg>
  )
}

export default function DoneView({ deleteResult, onNewScan }) {
  const { t } = useLang()
  const [animate, setAnimate] = useState(false)
  const seenRef = useRef(new Set())
  const uid = useId()
  const glowId = `done-glow-${uid.replace(/:/g, '')}`

  useEffect(() => {
    // Defer one frame so the transition fires
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  if (!deleteResult) return null

  const succeeded = deleteResult.results.filter(r => r.success)
  const skipped   = deleteResult.results.filter(r => !r.success)
  const hasItems  = deleteResult.results.length > 0
  const btnRadius = Math.round(INNER_D * 0.86)

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '18px', textAlign: 'center',
      }}>

        {/* Title */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px',
            color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.01em',
          }}>
            {t('done.title')}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '12px',
            color: 'var(--text-secondary)', margin: 0,
          }}>
            {succeeded.length > 0
              ? t('done.subtitle', { n: succeeded.length })
              : t('done.subtitleNone')}
          </p>
        </div>

        {/* Ring with checkmark center */}
        <div style={{ position: 'relative', width: SVG_SIZE, height: SVG_SIZE }}>
          <RingDone animate={animate} glowId={glowId} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: btnRadius, height: btnRadius,
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1px solid var(--border-strong)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CenterCheck visible={animate} />
            </div>
          </div>
        </div>

        {/* Freed size */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '1.1rem',
            color: deleteResult.totalFreed > 0 ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'opacity 0.3s',
          }}>
            {formatSize(deleteResult.totalFreed)}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em',
          }}>
            {t('done.freed')}
          </div>
        </div>

        {/* New scan button */}
        <button
          onClick={onNewScan}
          style={{
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px',
            color: 'var(--text)', background: 'var(--surface)',
            border: '1px solid var(--border-strong)',
            borderRadius: '8px', padding: '8px 24px',
            cursor: 'pointer', marginTop: '4px',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
        >
          {t('done.newScan')}
        </button>

        {/* Item list — same style as ScanView's completed list */}
        {hasItems && (
          <div style={{
            width: '250px', maxHeight: '110px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '3px',
          }}>
            {succeeded.map(r => {
              const isNew = !seenRef.current.has(r.path)
              if (isNew) seenRef.current.add(r.path)
              return (
                <div key={r.path} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '4px 8px', borderRadius: '6px',
                  background: 'var(--surface)',
                  animation: isNew ? 'scan-item-enter 0.3s ease-out both' : 'none',
                }}>
                  <RowCheck />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                    color: 'var(--text-secondary)', flex: 1,
                    textAlign: 'left', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {r.name}
                  </span>
                  {r.size > 0 && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                      color: 'var(--text-muted)', flexShrink: 0,
                    }}>
                      {formatSize(r.size)}
                    </span>
                  )}
                </div>
              )
            })}

            {skipped.map(r => (
              <div key={r.path} style={{
                display: 'flex', flexDirection: 'column', gap: '2px',
                padding: '4px 8px', borderRadius: '6px',
                background: 'var(--surface)',
                opacity: r.hint === 'trashBusy' ? 1 : 0.4,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                    color: 'var(--text-muted)', flexShrink: 0, lineHeight: 1,
                  }}>—</span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                    color: 'var(--text-muted)', flex: 1,
                    textAlign: 'left', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {r.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.6rem',
                    color: 'var(--text-muted)', letterSpacing: '0.06em',
                    textTransform: 'uppercase', flexShrink: 0,
                  }}>
                    {t('done.skipped')}
                  </span>
                </div>
                {r.hint === 'trashBusy' && (
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.65rem',
                    color: 'var(--warning)', paddingLeft: '18px',
                  }}>
                    {t('done.trashBusy')}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  )
}

import React, { useRef } from 'react'
import { formatSize } from '../utils.js'
import { useLang } from '../i18n/index.jsx'

function StopIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" stroke="currentColor"
         strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="12" height="12" rx="2.5" />
    </svg>
  )
}

function CheckIcon({ size = 11 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none"
         stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
         style={{ animation: 'scan-tick 0.35s cubic-bezier(0.34,1.56,0.64,1) both', display: 'block', flexShrink: 0 }}>
      <polyline points="2.5,7.5 6,11 12.5,4" />
    </svg>
  )
}

export default function ScanView({ progress, completedCount, totalCount, onAbort }) {
  const { t } = useLang()
  const seenDone = useRef(new Set())

  const items      = Object.values(progress)
  const currentItem = items.find(i => i.status === 'scanning')
  const doneItems  = items.filter(i => i.status === 'done')
  const progressFraction = totalCount > 0 ? completedCount / totalCount : 0
  const foundSoFar = doneItems.reduce((s, i) => s + (i.size || 0), 0)

  const svgSize = 220
  const RADIUS  = 88
  const STROKE  = 10
  const CIRC    = 2 * Math.PI * RADIUS
  const cx = 110, cy = 110

  const isComplete  = progressFraction >= 0.995
  const progressDash = CIRC * progressFraction

  const innerDiameter = (RADIUS - STROKE / 2) * 2  // 166px
  const btnSize = Math.round(innerDiameter * 0.86)  // ~142px

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '18px', textAlign: 'center',
      }}>

        {/* Title + current item */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px',
            color: 'var(--text)', margin: '0 0 6px', letterSpacing: '-0.01em',
          }}>
            {t('scan.title')}
          </h2>
          <div style={{ minHeight: '18px' }}>
            {currentItem && (
              <p key={currentItem.id} style={{
                fontFamily: 'var(--font-body)', fontSize: '12px',
                color: 'var(--text-secondary)', margin: 0,
                animation: 'scan-item-enter 0.2s ease-out both',
                maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {currentItem.name}
              </p>
            )}
          </div>
        </div>

        {/* Animated ring */}
        <div style={{ position: 'relative', width: svgSize, height: svgSize }}>
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}
               style={{ display: 'block', overflow: 'visible' }}>
            <defs>
              <filter id="scan-glow" x="-25%" y="-25%" width="150%" height="150%">
                <feGaussianBlur stdDeviation="4.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Track */}
            <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                    stroke="var(--border)" strokeWidth={STROKE} />

            {/* Progress fill */}
            <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                    stroke="var(--accent)" strokeWidth={STROKE}
                    strokeLinecap={isComplete ? 'butt' : 'round'}
                    strokeDasharray={`${progressDash} ${CIRC}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    filter="url(#scan-glow)"
                    style={{
                      transition: 'stroke-dasharray 0.55s cubic-bezier(0.16,1,0.3,1)',
                      opacity: 0.85,
                    }} />

            {/* Orbital arc 1 – fast, short */}
            <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'scan-spin 1.05s linear infinite' }}>
              <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                      stroke="var(--accent)" strokeWidth={3.5} strokeLinecap="round"
                      strokeDasharray={`${CIRC * 0.16} ${CIRC * 0.84}`}
                      transform={`rotate(-90 ${cx} ${cy})`}
                      style={{ opacity: 0.75 }} />
            </g>

            {/* Orbital arc 2 – slower, reverse, wispy */}
            <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'scan-orbit-rev 2.1s linear infinite' }}>
              <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                      stroke="var(--accent)" strokeWidth={2} strokeLinecap="round"
                      strokeDasharray={`${CIRC * 0.08} ${CIRC * 0.92}`}
                      transform={`rotate(-90 ${cx} ${cy})`}
                      style={{ opacity: 0.4 }} />
            </g>

            {/* Orbital arc 3 – medium, slow forward, longest */}
            <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'scan-spin 3.4s linear infinite' }}>
              <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                      stroke="var(--accent)" strokeWidth={1.5} strokeLinecap="round"
                      strokeDasharray={`${CIRC * 0.28} ${CIRC * 0.72}`}
                      transform={`rotate(-90 ${cx} ${cy})`}
                      style={{ opacity: 0.25 }} />
            </g>

            {/* Pulse ring 1 */}
            <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'scan-emanate 2.4s ease-out infinite' }}>
              <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                      stroke="var(--accent)" strokeWidth={1.5} />
            </g>

            {/* Pulse ring 2 – offset by 1.2s */}
            <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'scan-emanate 2.4s ease-out 1.2s infinite' }}>
              <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                      stroke="var(--accent)" strokeWidth={1.5} />
            </g>
          </svg>

          {/* Stop button */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <button
              onClick={onAbort}
              style={{
                width: btnSize, height: btnSize,
                borderRadius: '50%',
                background: 'var(--surface)',
                border: '1px solid var(--border-strong)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'border-color 0.2s, color 0.2s, background 0.2s',
                animation: 'scan-btn-breathe 2.8s ease-in-out infinite',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--danger)'
                e.currentTarget.style.color = 'var(--danger)'
                e.currentTarget.style.background = 'var(--danger-dim)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              <StopIcon size={Math.round(btnSize * 0.2)} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: '1.1rem',
            color: 'var(--accent)',
            minHeight: '1.4rem',
            transition: 'opacity 0.3s',
            opacity: foundSoFar > 0 ? 1 : 0,
          }}>
            {foundSoFar > 0 ? formatSize(foundSoFar) : '—'}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6rem',
            color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.09em',
          }}>
            {completedCount}/{totalCount} kategorier
          </div>
        </div>

        {/* Completed items – compact scrolling list */}
        {doneItems.length > 0 && (
          <div style={{
            width: '250px', maxHeight: '110px', overflowY: 'auto',
            display: 'flex', flexDirection: 'column', gap: '3px',
          }}>
            {[...doneItems].reverse().map(item => {
              const key = item.id + '-done'
              const isNew = !seenDone.current.has(key)
              if (isNew) seenDone.current.add(key)
              return (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '4px 8px', borderRadius: '6px',
                  background: 'var(--surface)',
                  animation: isNew ? 'scan-item-enter 0.3s ease-out both' : 'none',
                }}>
                  <CheckIcon size={11} />
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '0.72rem',
                    color: 'var(--text-secondary)', flex: 1,
                    textAlign: 'left', overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.name}
                  </span>
                  {item.size > 0 && (
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
                      color: 'var(--text-muted)', flexShrink: 0,
                    }}>
                      {formatSize(item.size)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

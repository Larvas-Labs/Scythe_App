import React, { useState } from 'react'
import { useLang } from '../i18n/index.jsx'
import { formatSize } from '../utils.js'

function PlayIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  )
}

function IdleRing({ totalEstimate, maxEstimate, onStartScan }) {
  const [pressing, setPressing] = useState(false)
  const [hovered,  setHovered]  = useState(false)

  const svgSize = 220
  const RADIUS  = 88
  const STROKE  = 10
  const CIRC    = 2 * Math.PI * RADIUS
  const cx = 110, cy = 110

  const GAP_FRACTION = 0.03
  const MIN_GAP    = CIRC * GAP_FRACTION
  const fraction   = maxEstimate > 0 ? Math.min(totalEstimate / maxEstimate, 1) : 1
  const dashOffset = Math.max(CIRC * (1 - fraction), MIN_GAP)

  // Center the gap at 12 o'clock: gap spans ±GAP/2 around top.
  // dashOffset places the gap at the END of the arc, so rotate the arc
  // forward by half the gap angle so it straddles the top symmetrically.
  const gapAngle   = GAP_FRACTION * 360                  // 9°
  const arcRotate  = -90 + gapAngle / 2                  // -85.5°
  const hasEstimate = totalEstimate > 0

  const innerDiameter = (RADIUS - STROKE / 2) * 2   // 166 px
  const btnSize       = Math.round(innerDiameter * 0.86) // ~142 px

  const handleClick = () => {
    if (pressing) return
    setPressing(true)
    setTimeout(onStartScan, 320)
    setTimeout(() => setPressing(false), 600)
  }

  return (
    <div style={{ position: 'relative', width: svgSize, height: svgSize }}>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}
           style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <filter id="idle-ring-glow" x="-22%" y="-22%" width="144%" height="144%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="idle-orbit-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost arcs — multiple lengths, speeds, opacities */}
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'idle-orbit-arc 11s linear infinite' }}>
          <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={2} strokeLinecap="round"
                  strokeDasharray={`${CIRC * 0.20} ${CIRC * 0.80}`}
                  transform={`rotate(-90 ${cx} ${cy})`} />
        </g>
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'idle-orbit-arc 17s linear infinite reverse' }}>
          <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1.5} strokeLinecap="round"
                  strokeDasharray={`${CIRC * 0.10} ${CIRC * 0.90}`}
                  transform={`rotate(40 ${cx} ${cy})`} />
        </g>
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'idle-orbit-arc 26s linear infinite' }}>
          <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={1} strokeLinecap="round"
                  strokeDasharray={`${CIRC * 0.32} ${CIRC * 0.68}`}
                  transform={`rotate(150 ${cx} ${cy})`} />
        </g>
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'idle-orbit-arc 8s linear infinite reverse' }}>
          <circle cx={cx} cy={cy} r={RADIUS} fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1.5} strokeLinecap="round"
                  strokeDasharray={`${CIRC * 0.07} ${CIRC * 0.93}`}
                  transform={`rotate(220 ${cx} ${cy})`} />
        </g>
      </svg>

      {/* Button */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleClick}
          style={{
            position: 'relative',
            width: btnSize,
            height: btnSize,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 32%, #FFB84D 0%, #FF9500 52%, #E08000 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(0,0,0,0.72)',
            animation: pressing
              ? 'idle-btn-press 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards'
              : hovered
                ? 'none'
                : 'idle-btn-glow 3.8s ease-in-out infinite',
            boxShadow: hovered
              ? '0 0 40px rgba(255,149,0,0.38), 0 0 80px rgba(255,149,0,0.14), inset 0 1px 0 rgba(255,255,255,0.30)'
              : undefined,
            transform: hovered && !pressing ? 'scale(1.04)' : undefined,
            transition: 'box-shadow 0.35s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Shimmer sweep — own overflow clip so it doesn't affect icon */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
            pointerEvents: 'none',
          }}>
          <div style={{
            position: 'absolute',
            width: '200%', height: '200%',
            top: '-50%', left: '-50%',
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.13) 8%, transparent 16%, transparent 100%)',
            animationName: 'idle-btn-shimmer',
            animationDuration: hovered ? '2s' : '5s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            pointerEvents: 'none',
          }} />
          </div>

          {/* Inner highlight — top-edge specularity */}
          <div style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 20%, rgba(255,255,255,0.22) 0%, transparent 58%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <PlayIcon size={Math.round(btnSize * 0.36)} />
          </div>
        </button>
      </div>
    </div>
  )
}

export default function IdleView({ onStartScan, totalEstimate = 0, maxEstimate = 0 }) {
  const { t } = useLang()
  const hasEstimate = totalEstimate > 0

  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '20px', textAlign: 'center',
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px',
            color: 'var(--text)', margin: '0 0 8px', letterSpacing: '-0.01em',
          }}>
            {t('idle.title')}
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '13px',
            color: 'var(--text-secondary)', lineHeight: 1.55,
            margin: 0, maxWidth: '260px',
          }}>
            {t('idle.subtitle')}
          </p>
        </div>

        <IdleRing
          totalEstimate={totalEstimate}
          maxEstimate={maxEstimate}
          onStartScan={onStartScan}
        />

      </div>
    </div>
  )
}

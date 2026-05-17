import React from 'react'
import { formatSize } from '../utils.js'

export default function StorageRing({ size = 0, selectedSize = 0, svgSize = 200, showLegend = true, centerValue, centerLabel }) {
  const RADIUS = 80
  const STROKE = 12
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const cx = 100
  const cy = 100

  const GAP_FRACTION = 0.04
  const MIN_GAP = CIRCUMFERENCE * GAP_FRACTION
  const fraction = size > 0 ? Math.min(selectedSize / size, 1) : 0
  const dashOffset = Math.max(CIRCUMFERENCE * (1 - fraction), MIN_GAP)
  const gapAngle = GAP_FRACTION * 360
  const arcRotate = -90 + gapAngle / 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ position: 'relative' }}>
        <svg
          width={svgSize}
          height={svgSize}
          viewBox="0 0 200 200"
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9500" />
              <stop offset="100%" stopColor="#FF9500" />
            </linearGradient>
            <filter id="ring-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={cx}
            cy={cy}
            r={RADIUS}
            fill="none"
            stroke="var(--surface)"
            strokeWidth={STROKE}
          />

          <circle
            cx={cx}
            cy={cy}
            r={RADIUS}
            fill="none"
            stroke="url(#ring-grad)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform={`rotate(${arcRotate} ${cx} ${cy})`}
            filter="url(#ring-glow)"
            style={{
              opacity: fraction > 0 ? 1 : 0.4,
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
            }}
          />
        </svg>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: (centerValue ?? size) >= 1024 ** 3 ? (svgSize < 180 ? '1rem' : '1.5rem') : (svgSize < 180 ? '0.9rem' : '1.25rem'),
              color: 'var(--accent)',
              lineHeight: 1.1,
              transition: 'none',
            }}
          >
            {formatSize(centerValue ?? size)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: svgSize < 180 ? '0.62rem' : '0.7rem',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            {centerLabel ?? ''}
          </div>
        </div>
      </div>

      {showLegend && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: svgSize < 180 ? '0.85rem' : '1rem',
              fontWeight: 500,
              color: 'var(--accent)',
            }}
          >
            {formatSize(selectedSize)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            valt
          </div>
        </div>
      )}
    </div>
  )
}

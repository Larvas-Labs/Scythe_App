import React from 'react'
import { formatSize } from '../utils.js'

const CATEGORY_COLORS = {
  user:      'oklch(80% 0.18 155)',
  browsers:  'oklch(61% 0.20 260)',
  developer: 'oklch(68% 0.19 300)',
  apps:      'oklch(72% 0.17 60)',
  advanced:  'oklch(60% 0.22 25)',
}

export default function StorageRing({ size = 0, selectedSize = 0, animating = false }) {
  const RADIUS = 80
  const STROKE = 12
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const cx = 100
  const cy = 100
  const viewBoxSize = 200

  const fraction = size > 0 ? Math.min(selectedSize / size, 1) : 0
  const dashOffset = CIRCUMFERENCE * (1 - fraction)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative' }}>
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          style={{ display: 'block' }}
        >
          <defs>
            <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(80% 0.18 155)" />
              <stop offset="100%" stopColor="oklch(61% 0.20 260)" />
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
            className="ring-dash"
            transform={`rotate(-90 ${cx} ${cy})`}
            filter="url(#ring-glow)"
            style={{ opacity: fraction > 0 ? 1 : 0.4 }}
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
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 500,
              fontSize: size >= 1024 ** 3 ? '1.5rem' : '1.25rem',
              color: 'var(--text)',
              lineHeight: 1.1,
            }}
          >
            {formatSize(size)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              marginTop: '2px',
            }}
          >
            kan rensas
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '1rem',
            fontWeight: 500,
            color: 'var(--accent-green)',
          }}
        >
          {formatSize(selectedSize)}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '2px',
          }}
        >
          valt
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', paddingLeft: '8px' }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

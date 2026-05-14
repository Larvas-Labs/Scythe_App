import React from 'react'

function ScytheIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scythe-grad-idle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9500" />
          <stop offset="100%" stopColor="#FF9500" />
        </linearGradient>
        <radialGradient id="bg-glow-idle" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#131313" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#bg-glow-idle)" stroke="#2a2a2a" strokeWidth="2" />
      <path
        d="M 42 28 C 42 28 72 32 72 50 C 72 65 38 65 38 78 C 38 92 70 95 70 95"
        stroke="url(#scythe-grad-idle)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="70,95 64,88 76,89" fill="#FF9500" />
      <line x1="78" y1="25" x2="44" y2="98" stroke="#888888" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

export default function IdleView({ onStartScan }) {
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
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '380px',
        width: '100%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <ScytheIcon size={80} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '22px',
          color: 'var(--text)',
          margin: '0 0 10px',
        }}>
          Ready to harvest
        </h1>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 32px',
        }}>
          Välj kategorier i sidebaren och kör scanning
        </p>

        <button
          className="btn-primary"
          onClick={onStartScan}
          style={{
            padding: '12px 40px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Kör scanning
        </button>
      </div>
    </div>
  )
}

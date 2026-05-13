import React from 'react'

function ScytheIcon({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scythe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E57A" />
          <stop offset="100%" stopColor="#0096FF" />
        </linearGradient>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#161932" />
          <stop offset="100%" stopColor="#0C0E1A" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#bg-glow)" stroke="#1C1F3A" strokeWidth="2" />
      <path
        d="M 42 28 C 42 28 72 32 72 50 C 72 65 38 65 38 78 C 38 92 70 95 70 95"
        stroke="url(#scythe-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon
        points="70,95 64,88 76,89"
        fill="#00E57A"
      />
      <line
        x1="78" y1="25"
        x2="44" y2="98"
        stroke="#0096FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

export default function EmptyState({ onStartScan }) {
  return (
    <div className="flex flex-col items-center text-center pt-8 pb-4">
      <ScytheIcon size={120} />
      <h1
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: '1.75rem',
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
          color: 'var(--text)',
        }}
      >
        Ready to harvest
      </h1>
      <p
        style={{
          fontFamily: 'DM Sans, sans-serif',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          maxWidth: '320px',
          lineHeight: 1.5,
          marginBottom: '1.5rem',
        }}
      >
        Kör en scanning för att hitta filer som kan rensas
      </p>
      <button
        className="btn-gradient"
        style={{
          padding: '12px 40px',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 600,
        }}
        onClick={onStartScan}
      >
        Kör scanning
      </button>
    </div>
  )
}

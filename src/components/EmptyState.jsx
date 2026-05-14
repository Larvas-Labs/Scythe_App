import React from 'react'

function ScytheIcon({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="scythe-grad-es" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="oklch(83% 0.245 152)" />
          <stop offset="100%" stopColor="oklch(63% 0.244 257)" />
        </linearGradient>
        <radialGradient id="bg-glow-es" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(13.5% 0.025 279)" />
          <stop offset="100%" stopColor="oklch(7.5% 0.018 279)" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#bg-glow-es)" stroke="oklch(24% 0.018 280)" strokeWidth="2" />
      <path
        d="M 42 28 C 42 28 72 32 72 50 C 72 65 38 65 38 78 C 38 92 70 95 70 95"
        stroke="url(#scythe-grad-es)"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon
        points="70,95 64,88 76,89"
        fill="oklch(83% 0.245 152)"
      />
      <line
        x1="78" y1="25"
        x2="44" y2="98"
        stroke="oklch(63% 0.244 257)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center">
      <ScytheIcon size={100} />
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.6rem',
          marginTop: '1.25rem',
          marginBottom: '0.5rem',
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
          maxWidth: '260px',
          lineHeight: 1.6,
        }}
      >
        Välj kategorier och kör en scanning för att hitta filer som kan rensas
      </p>
    </div>
  )
}

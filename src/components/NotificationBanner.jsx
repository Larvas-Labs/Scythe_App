import React from 'react'

function CloseIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="1" y1="1" x2="13" y2="13"/>
      <line x1="13" y1="1" x2="1" y2="13"/>
    </svg>
  )
}

export default function NotificationBanner({ notifications, onDismiss, onCta }) {
  if (!notifications || notifications.length === 0) return null

  const item = notifications[0]
  const isCritical = item.type === 'critical'

  const accentColor = isCritical ? 'var(--danger)' : 'var(--accent)'
  const bgColor = isCritical ? 'var(--danger-dim)' : 'var(--accent-dim)'
  const hoverBg = isCritical ? 'var(--danger-dim)' : 'var(--accent-dim)'

  return (
    <div style={{
      background: bgColor,
      borderBottom: '1px solid var(--border)',
      padding: '7px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexShrink: 0,
    }}>
      {/* Type indicator dot */}
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: accentColor,
        flexShrink: 0,
      }} />

      {/* Message */}
      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: 'var(--text-secondary)',
        flex: 1,
      }}>
        {item.message}
      </span>

      {/* CTA button */}
      {item.cta && (
        <button
          onClick={() => onCta?.(item)}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            color: accentColor,
            background: 'transparent',
            border: `1px solid ${accentColor}`,
            borderRadius: '5px',
            padding: '3px 10px',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = hoverBg }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          {item.cta.label}
        </button>
      )}

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss?.(item.id)}
        title="Dismiss"
        style={{
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: isCritical ? 'var(--danger)' : 'var(--text-muted)',
          cursor: 'pointer',
          borderRadius: '4px',
          flexShrink: 0,
          transition: 'color 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = isCritical ? 'var(--danger)' : 'var(--text-secondary)' }}
        onMouseLeave={e => { e.currentTarget.style.color = isCritical ? 'var(--danger)' : 'var(--text-muted)' }}
      >
        <CloseIcon />
      </button>
    </div>
  )
}

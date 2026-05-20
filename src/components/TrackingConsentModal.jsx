import React from 'react'
import { useLang } from '../i18n/index.jsx'

function CheckRow({ label, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px 0' }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="7" cy="7" r="6.5" stroke="var(--accent)" strokeWidth="1" />
        <path d="M4 7L6 9.5L10 5" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '1px' }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

function CrossRow({ label, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '4px 0' }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="7" cy="7" r="6.5" stroke="var(--border-strong)" strokeWidth="1" />
        <path d="M5 5L9 9M9 5L5 9" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, marginTop: '1px' }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

function GhostButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--text)',
        background: 'transparent',
        border: '1px solid var(--border-strong)',
        borderRadius: '8px',
        padding: '11px 0',
        cursor: 'pointer',
        transition: 'color 0.12s, border-color 0.12s, background 0.12s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--surface-hover)'
        e.currentTarget.style.borderColor = 'var(--text-muted)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.borderColor = 'var(--border-strong)'
      }}
    >
      {children}
    </button>
  )
}

const sectionLabel = {
  fontFamily: 'var(--font-body)',
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '6px',
}

export default function TrackingConsentModal({ onAccept, onDecline }) {
  const { t } = useLang()

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(6px)',
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: '14px',
        width: '420px',
        padding: '24px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>

        {/* Title */}
        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--text)',
            margin: '0 0 8px',
          }}>
            {t('consent.title')}
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {t('consent.intro')}
          </p>
        </div>

        {/* Tracked */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px 14px',
        }}>
          <div style={sectionLabel}>{t('consent.trackedHeader')}</div>
          <CheckRow label={t('consent.tracked.open')}        desc={t('consent.tracked.open.desc')} />
          <CheckRow label={t('consent.tracked.appVersion')}  desc={t('consent.tracked.appVersion.desc')} />
          <CheckRow label={t('consent.tracked.update')}      desc={t('consent.tracked.update.desc')} />
          <CheckRow label={t('consent.tracked.scanStarted')} desc={t('consent.tracked.scanStarted.desc')} />
          <CheckRow label={t('consent.tracked.scanDone')}    desc={t('consent.tracked.scanDone.desc')} />
          <CheckRow label={t('consent.tracked.delete')}      desc={t('consent.tracked.delete.desc')} />
          <CheckRow label={t('consent.tracked.bytes')}       desc={t('consent.tracked.bytes.desc')} />
          <CheckRow label={t('consent.tracked.os')}          desc={t('consent.tracked.os.desc')} />
        </div>

        {/* Not tracked */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '12px 14px',
        }}>
          <div style={sectionLabel}>{t('consent.notTrackedHeader')}</div>
          <CrossRow label={t('consent.notTracked.personal')}  desc={t('consent.notTracked.personal.desc')} />
          <CrossRow label={t('consent.notTracked.paths')}     desc={t('consent.notTracked.paths.desc')} />
          <CrossRow label={t('consent.notTracked.folders')}   desc={t('consent.notTracked.folders.desc')} />
          <CrossRow label={t('consent.notTracked.sessionId')} desc={t('consent.notTracked.sessionId.desc')} />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <GhostButton onClick={onAccept}>{t('consent.accept')}</GhostButton>
          <GhostButton onClick={onDecline}>{t('consent.decline')}</GhostButton>
        </div>

      </div>
    </div>
  )
}

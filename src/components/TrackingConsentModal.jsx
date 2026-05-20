import React from 'react'
import { useLang } from '../i18n/index.jsx'

function CheckRow({ label, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', padding: '4px 0' }}>
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
        <path d="M1 3.5L3.5 6L8 1" stroke="#30D158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', padding: '4px 0' }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" style={{ flexShrink: 0, marginTop: '4px' }}>
        <path d="M1 1L7 7M7 1L1 7" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" />
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
  marginBottom: '8px',
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
        width: '520px',
        padding: '24px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
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

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '-4px 0' }} />

        {/* Two columns */}
        <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start' }}>

          {/* Tracked */}
          <div style={{ flex: 1 }}>
            <div style={sectionLabel}>{t('consent.trackedHeader')}</div>
            <CheckRow label={t('consent.tracked.open')}     desc={t('consent.tracked.open.desc')} />
            <CheckRow label={t('consent.tracked.scan')}     desc={t('consent.tracked.scan.desc')} />
            <CheckRow label={t('consent.tracked.cleanup')}  desc={t('consent.tracked.cleanup.desc')} />
            <CheckRow label={t('consent.tracked.versions')} desc={t('consent.tracked.versions.desc')} />
            <CheckRow label={t('consent.tracked.update')}   desc={t('consent.tracked.update.desc')} />
          </div>

          {/* Vertical divider */}
          <div style={{ width: '1px', background: 'var(--border)', alignSelf: 'stretch', margin: '0 20px' }} />

          {/* Not tracked */}
          <div style={{ flex: 1 }}>
            <div style={sectionLabel}>{t('consent.notTrackedHeader')}</div>
            <CrossRow label={t('consent.notTracked.personal')}  desc={t('consent.notTracked.personal.desc')} />
            <CrossRow label={t('consent.notTracked.filepaths')} desc={t('consent.notTracked.filepaths.desc')} />
            <CrossRow label={t('consent.notTracked.sessionId')} desc={t('consent.notTracked.sessionId.desc')} />
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '-4px 0' }} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <GhostButton onClick={onAccept}>{t('consent.accept')}</GhostButton>
          <GhostButton onClick={onDecline}>{t('consent.decline')}</GhostButton>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.5,
        }}>
          {t('consent.footer')}
        </p>

      </div>
    </div>
  )
}

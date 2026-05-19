import React from 'react'

export function IconUser({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="3" />
      <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" />
    </svg>
  )
}

export function IconGlobe({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3c-2 2-3 4.5-3 7s1 5 3 7" />
      <path d="M10 3c2 2 3 4.5 3 7s-1 5-3 7" />
      <line x1="3" y1="10" x2="17" y2="10" />
    </svg>
  )
}

export function IconCode({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 5L2 10l5 5" />
      <path d="M13 5l5 5-5 5" />
      <line x1="11" y1="4" x2="9" y2="16" />
    </svg>
  )
}

export function IconGrid({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  )
}

export function IconGear({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.22 4.22l1.77 1.77M14.01 14.01l1.77 1.77M4.22 15.78l1.77-1.77M14.01 5.99l1.77-1.77" />
    </svg>
  )
}

export function IconSearch({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8.5" cy="8.5" r="5" />
      <line x1="13" y1="13" x2="17" y2="17" />
    </svg>
  )
}

export function IconTrash({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="12" height="12" rx="2" />
      <line x1="2" y1="6" x2="18" y2="6" />
      <path d="M8 6V4h4v2" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <line x1="12" y1="10" x2="12" y2="14" />
    </svg>
  )
}

export function IconFolder({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7a2 2 0 012-2h3.5L9 7h9a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
    </svg>
  )
}

export function IconPackage({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="8" width="16" height="10" rx="2" />
      <path d="M2 8l8-5 8 5" />
      <line x1="10" y1="8" x2="10" y2="18" />
    </svg>
  )
}

export function IconPhone({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="1" width="8" height="18" rx="2" />
      <circle cx="10" cy="16" r="1" fill={color} stroke="none" />
    </svg>
  )
}

export function IconHardDrive({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="10" rx="2" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  )
}

export function IconMusicNote({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 16V6l9-2v10" />
      <circle cx="6" cy="16" r="2" />
      <circle cx="15" cy="14" r="2" />
    </svg>
  )
}

export function IconVideo({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="12" height="10" rx="2" />
      <path d="M14 8l4-2v8l-4-2V8z" />
    </svg>
  )
}

export function IconCloud({ size = 18, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 14H16a4 4 0 000-8 4.5 4.5 0 00-8.9-.5A4 4 0 004 14h1.5" />
      <path d="M10 14v4M8 16l2 2 2-2" />
    </svg>
  )
}

export const ITEM_ICON_MAP = {
  'user-caches':    IconFolder,
  'user-logs':      IconHardDrive,
  'trash':          IconTrash,
  'chrome-cache':   IconGlobe,
  'safari-cache':   IconGlobe,
  'firefox-cache':  IconGlobe,
  'arc-cache':      IconGlobe,
  'brave-cache':    IconGlobe,
  'npm-cache':      IconCode,
  'yarn-cache':     IconCode,
  'pnpm-store':     IconCode,
  'homebrew-cache': IconPackage,
  'xcode-derived':  IconCode,
  'xcode-archives': IconPackage,
  'ios-simulators': IconPhone,
  'slack-cache':    IconGrid,
  'spotify-cache':  IconMusicNote,
  'zoom-cache':     IconVideo,
  'vscode-cache':   IconCode,
  'figma-cache':    IconGrid,
  'docker-data':    IconCloud,
  'system-caches':  IconGear,
  'system-logs':    IconHardDrive,
  'temp-system':    IconGear,
}

// ─── Category sidebar icons (16px, minimalistic) ─────────────────────────────

export function IconCatUser({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="12" height="10" rx="2" />
      <line x1="5" y1="7" x2="11" y2="7" />
      <line x1="5" y1="10" x2="8.5" y2="10" />
    </svg>
  )
}

export function IconCatBrowsers({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <path d="M8 2c-1.5 1.5-2.5 3.6-2.5 6s1 4.5 2.5 6" />
      <path d="M8 2c1.5 1.5 2.5 3.6 2.5 6s-1 4.5-2.5 6" />
    </svg>
  )
}

export function IconCatDeveloper({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 4.5L2 8l3.5 3.5" />
      <path d="M10.5 4.5L14 8l-3.5 3.5" />
      <line x1="9.5" y1="3" x2="6.5" y2="13" />
    </svg>
  )
}

export function IconCatApps({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="5" height="5" rx="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1.5" />
    </svg>
  )
}

export function IconCatAdvanced({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L1.5 13.5h13L8 2z" />
      <line x1="8" y1="7" x2="8" y2="10" />
      <circle cx="8" cy="12" r="0.6" fill={color} stroke="none" />
    </svg>
  )
}

export function IconCatOrphaned({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11V8a5 5 0 0110 0v3l-1.5 1.5L10 13l-1.5 1.5L7 13l-1.5 1.5L4 13z" />
      <circle cx="6" cy="8.5" r="0.8" fill={color} stroke="none" />
      <circle cx="10" cy="8.5" r="0.8" fill={color} stroke="none" />
    </svg>
  )
}

export const CATEGORY_ICON_MAP = {
  user:      IconCatUser,
  browsers:  IconCatBrowsers,
  developer: IconCatDeveloper,
  apps:      IconCatApps,
  orphaned:  IconCatOrphaned,
  advanced:  IconCatAdvanced,
}

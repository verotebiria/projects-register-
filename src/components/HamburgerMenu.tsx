import React from 'react';
import { C } from '../utils/tokens';
import type { Page } from '../types';

const PAGES: Page[] = ['Dashboard', 'Projects', 'Accounts', 'Add / Edit', 'Settings'];

const PAGE_ICONS: Record<Page, React.ReactNode> = {
  'Dashboard':  (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  'Projects': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  'Accounts': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  'Add / Edit': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  'Settings': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
};

interface Props {
  currentPage: Page;
  onNavigate: (p: Page) => void;
  onClose: () => void;
}

export function HamburgerMenu({ currentPage, onNavigate, onClose }: Props) {
  const others = PAGES.filter(p => p !== currentPage);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: 'rgba(0,0,0,0.60)',
    }} onClick={onClose}>
      <div style={{
        position: 'absolute', top: 0, right: 0, bottom: 0,
        width: '75%', maxWidth: 290,
        background: C.surface,
        borderLeft: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
      }} onClick={e => e.stopPropagation()}>

        {/* Header with app icon */}
        <div style={{
          padding: 'max(env(safe-area-inset-top), 24px) 20px 18px',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <img
            src="/icon_192x192.png"
            alt="Projects Register"
            style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, fontFamily: C.sans, letterSpacing: '-0.02em' }}>
              Projects
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.gold, fontFamily: C.sans, letterSpacing: '-0.02em', marginTop: -2 }}>
              Register
            </div>
          </div>
        </div>

        {/* Current page — always first, highlighted */}
        <button onClick={() => { onNavigate(currentPage); onClose(); }} style={{
          padding: '13px 20px',
          background: C.goldLo,
          border: 'none',
          borderBottom: `1px solid ${C.border}`,
          borderLeft: `3px solid ${C.gold}`,
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', textAlign: 'left', width: '100%',
        }}>
          <span style={{ color: C.gold, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            {PAGE_ICONS[currentPage]}
          </span>
          <span style={{ color: C.gold, fontSize: 14, fontWeight: 700, fontFamily: C.sans, flex: 1 }}>
            {currentPage}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700, color: C.gold,
            background: C.goldMid, borderRadius: 4,
            padding: '2px 6px', fontFamily: C.sans,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>Current</span>
        </button>

        {/* Other pages */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {others.map(page => (
            <button key={page} onClick={() => { onNavigate(page); onClose(); }} style={{
              padding: '13px 20px',
              background: 'transparent', border: 'none',
              borderBottom: `1px solid ${C.border}`,
              borderLeft: '3px solid transparent',
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: C.textMut, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {PAGE_ICONS[page]}
              </span>
              <span style={{ color: C.textSub, fontSize: 14, fontWeight: 600, fontFamily: C.sans }}>
                {page}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          paddingBottom: 'max(env(safe-area-inset-bottom), 14px)',
          borderTop: `1px solid ${C.border}`,
        }}>
          <span style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans }}>
            Projects Register v1.0.0
          </span>
        </div>
      </div>
    </div>
  );
}

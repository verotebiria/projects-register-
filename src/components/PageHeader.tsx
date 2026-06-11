import React from 'react';
import { C } from '../utils/tokens';

interface PageHeaderProps {
  title: string;
  onMenuOpen: () => void;
}

export function PageHeader({ title, onMenuOpen }: PageHeaderProps) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: C.bg,
      paddingTop: 'max(env(safe-area-inset-top), 18px)',
      padding: 'max(env(safe-area-inset-top), 18px) 16px 12px',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>

        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {/* Actual app icon */}
          <img
            src="/icon_192x192.png"
            alt="Projects Register"
            style={{
              width: 36, height: 36,
              borderRadius: 9,
              flexShrink: 0,
              objectFit: 'cover',
            }}
          />

          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 9, fontWeight: 700, color: C.textMut,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              fontFamily: C.sans, marginBottom: 1,
            }}>Projects Register</div>
            <h1 style={{
              margin: 0, fontSize: 19, fontWeight: 800,
              letterSpacing: '-0.025em', lineHeight: 1.1,
              fontFamily: C.sans,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {title === 'Dashboard'
                ? <><span style={{ color: C.text }}>Projects </span><span style={{ color: C.gold }}>Register</span></>
                : <span style={{ color: C.text }}>{title}</span>
              }
            </h1>
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          style={{
            background: 'transparent',
            border: `1px solid ${C.border}`,
            borderRadius: 9, width: 40, height: 40,
            cursor: 'pointer', flexShrink: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4.5,
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = C.gold)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 16, height: 1.5,
              background: C.textSub, borderRadius: 1,
            }} />
          ))}
        </button>
      </div>
    </div>
  );
}

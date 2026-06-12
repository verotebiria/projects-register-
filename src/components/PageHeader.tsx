import React from 'react';
import { C } from '../utils/tokens';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  onEdit?: () => void;
  onMenuOpen?: () => void;
  rightLabel?: string;
  onRight?: () => void;
}

export function PageHeader({ title, onBack, onEdit, onMenuOpen, rightLabel, onRight }: PageHeaderProps) {
  return (
    <div style={{ position:'sticky', top:0, zIndex:50, background:C.bg, paddingTop:'max(env(safe-area-inset-top),16px)', padding:'max(env(safe-area-inset-top),16px) 16px 12px', borderBottom:`1px solid ${C.border}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>

        {/* Left — back button or app icon */}
        {onBack ? (
          <button onClick={onBack} style={{ background:'transparent', border:`1px solid ${C.border}`, borderRadius:8, width:36, height:36, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', color:C.textSub }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        ) : (
          <img src="/icon_192x192.png" alt="" style={{ width:34, height:34, borderRadius:8, flexShrink:0 }} />
        )}

        {/* Title */}
        <h1 style={{ margin:0, flex:1, fontSize:19, fontWeight:800, letterSpacing:'-0.025em', lineHeight:1.1, fontFamily:C.sans, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {title}
        </h1>

        {/* Right — edit, custom label, or hamburger */}
        {onEdit && (
          <button onClick={onEdit} style={{ background:C.goldLo, border:`1px solid ${C.goldMid}`, borderRadius:8, padding:'6px 14px', cursor:'pointer', color:C.gold, fontFamily:C.sans, fontWeight:700, fontSize:13, flexShrink:0 }}>
            Edit
          </button>
        )}
        {onRight && rightLabel && (
          <button onClick={onRight} style={{ background:C.goldLo, border:`1px solid ${C.goldMid}`, borderRadius:8, padding:'6px 14px', cursor:'pointer', color:C.gold, fontFamily:C.sans, fontWeight:700, fontSize:13, flexShrink:0 }}>
            {rightLabel}
          </button>
        )}
        {onMenuOpen && (
          <button onClick={onMenuOpen} style={{ background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, width:40, height:40, cursor:'pointer', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4.5 }}>
            {[0,1,2].map(i=><span key={i} style={{ display:'block', width:16, height:1.5, background:C.textSub, borderRadius:1 }}/>)}
          </button>
        )}
      </div>
    </div>
  );
}

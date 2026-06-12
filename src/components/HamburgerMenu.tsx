import React from 'react';
import { C } from '../utils/tokens';
import type { MenuPage } from '../types';

const PAGES: MenuPage[] = ['Projects','Platforms','Accounts','Add / Edit','Settings'];
const ICONS: Record<MenuPage, string> = {
  'Projects':  '📁',
  'Platforms': '🖥️',
  'Accounts':  '✉️',
  'Add / Edit':'➕',
  'Settings':  '⚙️',
};

export function HamburgerMenu({ currentPage, onNavigate, onClose }: {
  currentPage: MenuPage; onNavigate:(p:MenuPage)=>void; onClose:()=>void;
}) {
  const others = PAGES.filter(p => p !== currentPage);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:150, background:'rgba(0,0,0,0.62)' }} onClick={onClose}>
      <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'75%', maxWidth:290, background:C.surface, borderLeft:`1px solid ${C.border}`, display:'flex', flexDirection:'column' }} onClick={e=>e.stopPropagation()}>

        <div style={{ padding:'max(env(safe-area-inset-top),24px) 20px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
          <img src="/icon_192x192.png" alt="" style={{ width:40, height:40, borderRadius:10, flexShrink:0 }}/>
          <div>
            <div style={{ fontSize:15, fontWeight:800, color:C.text,   fontFamily:C.sans }}>Projects</div>
            <div style={{ fontSize:15, fontWeight:800, color:C.gold,   fontFamily:C.sans, marginTop:-2 }}>Register</div>
          </div>
        </div>

        {/* Current page — always first */}
        <button onClick={()=>{onNavigate(currentPage);onClose();}} style={{ padding:'13px 20px', background:C.goldLo, border:'none', borderBottom:`1px solid ${C.border}`, borderLeft:`3px solid ${C.gold}`, display:'flex', alignItems:'center', gap:12, cursor:'pointer', textAlign:'left', width:'100%' }}>
          <span style={{ fontSize:16 }}>{ICONS[currentPage]}</span>
          <span style={{ color:C.gold, fontSize:14, fontWeight:700, fontFamily:C.sans, flex:1 }}>{currentPage}</span>
          <span style={{ fontSize:9, fontWeight:700, color:C.gold, background:C.goldMid, borderRadius:4, padding:'2px 6px', fontFamily:C.sans, textTransform:'uppercase' as const, letterSpacing:'0.08em' }}>Current</span>
        </button>

        <div style={{ flex:1, overflowY:'auto' }}>
          {others.map(page=>(
            <button key={page} onClick={()=>{onNavigate(page);onClose();}} style={{ padding:'13px 20px', background:'transparent', border:'none', borderBottom:`1px solid ${C.border}`, borderLeft:'3px solid transparent', display:'flex', alignItems:'center', gap:12, cursor:'pointer', textAlign:'left', width:'100%' }}>
              <span style={{ fontSize:16 }}>{ICONS[page]}</span>
              <span style={{ color:C.textSub, fontSize:14, fontWeight:600, fontFamily:C.sans }}>{page}</span>
            </button>
          ))}
        </div>

        <div style={{ padding:'14px 20px', paddingBottom:'max(env(safe-area-inset-bottom),14px)', borderTop:`1px solid ${C.border}` }}>
          <span style={{ color:C.textMut, fontSize:11, fontFamily:C.sans }}>Projects Register v1.0.0</span>
        </div>
      </div>
    </div>
  );
}

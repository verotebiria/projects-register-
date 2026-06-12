import React, { useState, useEffect, useRef } from 'react';
import { C, STATUS_COLOR, STATUS_BG } from '../utils/tokens';
import type { ProjectStatus } from '../types';

export function SearchBar({ value, onChange, placeholder='Search...', count, total }: {
  value: string; onChange: (v:string)=>void; placeholder?: string; count?: number; total?: number;
}) {
  return (
    <div style={{ padding:'10px 16px 10px', background:C.bg, position:'sticky', top:62, zIndex:40, borderBottom:`1px solid ${C.border}` }}>
      <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
        <svg style={{ position:'absolute', left:11, width:15, height:15, color:value?C.gold:C.textMut, pointerEvents:'none', flexShrink:0 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
        </svg>
        <input
          type="search" value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width:'100%', background:C.surface, border:`1.5px solid ${value?C.gold:C.border}`, borderRadius:10, padding:'10px 40px 10px 34px', color:C.text, fontSize:14, fontFamily:C.sans, fontStyle:'italic', outline:'none', WebkitAppearance:'none' as const, transition:'border-color 0.2s' }}
        />
        {value && (
          <>
            {count!==undefined && total!==undefined && (
              <span style={{ position:'absolute', right:34, fontSize:11, fontWeight:700, color:count>0?C.green:C.textMut, background:count>0?C.greenLo:'rgba(74,79,99,0.12)', borderRadius:4, padding:'2px 6px', fontFamily:C.sans }}>{count}/{total}</span>
            )}
            <button onClick={()=>onChange('')} style={{ position:'absolute', right:9, background:'transparent', border:'none', color:C.textMut, cursor:'pointer', fontSize:19, lineHeight:1, padding:2 }}>×</button>
          </>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span style={{ fontSize:10, fontWeight:700, color:STATUS_COLOR[status]??C.textMut, background:STATUS_BG[status]??'transparent', borderRadius:4, padding:'3px 7px', fontFamily:C.sans, letterSpacing:'0.06em', textTransform:'uppercase' as const, flexShrink:0 }}>
      {status}
    </span>
  );
}

export function EmptyState({ icon, title, body }: { icon:string; title:string; body:string }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 32px', fontFamily:C.sans, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <span style={{ fontSize:40 }}>{icon}</span>
      <span style={{ color:C.text, fontWeight:700, fontSize:16 }}>{title}</span>
      <span style={{ color:C.textMut, fontSize:13, lineHeight:1.65, maxWidth:260 }}>{body}</span>
    </div>
  );
}

export function ConfirmDialog({ title, message, confirmLabel='Confirm', danger, onConfirm, onCancel }: {
  title:string; message:string; confirmLabel?:string; danger?:boolean; onConfirm:()=>void; onCancel:()=>void;
}) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(0,0,0,0.82)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:24, width:'100%', maxWidth:360 }}>
        <h3 style={{ color:C.text, fontFamily:C.sans, fontSize:17, fontWeight:800, marginBottom:10 }}>{title}</h3>
        <p style={{ color:C.textSub, fontFamily:C.sans, fontSize:14, lineHeight:1.6, marginBottom:20 }}>{message}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={onConfirm} style={{ padding:'11px 0', borderRadius:9, border:'none', background:danger?C.red:C.gold, color:danger?'#fff':'#0D1117', cursor:'pointer', fontFamily:C.sans, fontWeight:700, fontSize:14 }}>{confirmLabel}</button>
          <button onClick={onCancel} style={{ padding:'11px 0', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.textSub, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:14 }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

let _toastFn: ((msg:string, type?:'success'|'error')=>void)|null = null;
export function setToastFn(fn: typeof _toastFn) { _toastFn = fn; }
export function showToast(msg:string, type:'success'|'error'='success') { _toastFn?.(msg,type); }

export function ToastProvider() {
  const [toasts, setToasts] = useState<Array<{id:number;msg:string;type:'success'|'error'}>>([]);
  const counter = useRef(0);
  useEffect(() => {
    setToastFn((msg, type='success') => {
      const id = ++counter.current;
      setToasts(t => [...t,{id,msg,type}]);
      setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)), 2800);
    });
    return ()=>setToastFn(null);
  }, []);
  return (
    <div style={{ position:'fixed', bottom:28, left:16, right:16, zIndex:500, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
      {toasts.map(t=>(
        <div key={t.id} style={{ background:t.type==='success'?'#1A2F1E':'#2F1A1A', border:`1px solid ${t.type==='success'?C.green:C.red}`, color:t.type==='success'?C.green:C.red, borderRadius:10, padding:'12px 16px', fontSize:14, fontFamily:C.sans, fontWeight:600, boxShadow:'0 8px 24px rgba(0,0,0,0.5)', animation:'toastIn 0.22s ease' }}>{t.msg}</div>
      ))}
      <style>{'@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}'}</style>
    </div>
  );
}

export function Highlight({ text, query }: { text:string; query:string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx===-1) return <>{text}</>;
  return <>{text.slice(0,idx)}<mark style={{ background:C.goldLo, color:C.gold, borderRadius:2, padding:'0 1px' }}>{text.slice(idx,idx+query.length)}</mark>{text.slice(idx+query.length)}</>;
}

export function TagChip({ label }: { label:string }) {
  return <span style={{ fontSize:10, color:C.blue, background:C.blueLo, borderRadius:4, padding:'2px 7px', fontFamily:C.sans, fontWeight:600 }}>{label}</span>;
}

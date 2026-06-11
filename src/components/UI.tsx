import React, { useState, useEffect, useRef } from 'react';
import { C, STATUS_COLOR, STATUS_BG } from '../utils/tokens';
import type { ProjectStatus } from '../types';

// ── SearchBar ─────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  count?: number;
  total?: number;
  topOffset?: number;
}
export function SearchBar({ value, onChange, placeholder = 'Search…', count, total, topOffset = 72 }: SearchBarProps) {
  return (
    <div style={{
      padding: '8px 16px 10px',
      background: C.bg,
      position: 'sticky',
      top: topOffset,
      zIndex: 40,
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg style={{ position: 'absolute', left: 10, width: 15, height: 15, color: value ? C.accent : C.textMut, flexShrink: 0, pointerEvents: 'none', transition: 'color 0.2s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: C.surface,
            border: `1.5px solid ${value ? C.accent : C.border}`,
            borderRadius: 9, padding: '9px 40px 9px 32px',
            color: C.text, fontSize: 14, fontFamily: C.sans,
            outline: 'none', transition: 'border-color 0.2s',
            WebkitAppearance: 'none',
          }}
        />
        {value && (
          <>
            {count !== undefined && total !== undefined && (
              <span style={{
                position: 'absolute', right: 34, fontSize: 11, fontWeight: 700,
                color: count > 0 ? C.green : C.textMut,
                background: count > 0 ? C.greenLo : 'rgba(74,79,99,0.12)',
                borderRadius: 4, padding: '2px 6px', fontFamily: C.sans,
              }}>{count}/{total}</span>
            )}
            <button onClick={() => onChange('')} style={{
              position: 'absolute', right: 8, background: 'transparent', border: 'none',
              color: C.textMut, cursor: 'pointer', fontSize: 18, lineHeight: 1,
              padding: 2, display: 'flex', alignItems: 'center',
            }}>×</button>
          </>
        )}
      </div>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────
export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700,
      color: STATUS_COLOR[status] ?? C.textMut,
      background: STATUS_BG[status] ?? 'transparent',
      borderRadius: 4, padding: '3px 7px',
      fontFamily: C.sans, letterSpacing: '0.06em',
      textTransform: 'uppercase', flexShrink: 0,
    }}>{status}</span>
  );
}

// ── Tag ───────────────────────────────────────────────────────────
export function Tag({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: C.navyLo, color: C.blue,
      border: `1px solid ${C.blueLo}`,
      borderRadius: 5, padding: '3px 8px',
      fontSize: 11, fontFamily: C.sans, fontWeight: 600,
    }}>
      {label}
      {onRemove && (
        <button onClick={onRemove} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: C.textMut, padding: 0, lineHeight: 1, fontSize: 14,
        }}>×</button>
      )}
    </span>
  );
}

// ── TagInput ──────────────────────────────────────────────────────
export function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [val, setVal] = useState('');
  function add() {
    const t = val.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setVal('');
  }
  return (
    <div>
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {tags.map(t => <Tag key={t} label={t} onRemove={() => onChange(tags.filter(x => x !== t))} />)}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="Add tag, press Enter"
          style={{
            flex: 1, background: C.bg, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '9px 12px', color: C.text,
            fontSize: 13, fontFamily: C.sans, outline: 'none',
          }}
        />
        <button onClick={add} style={{
          background: C.goldLo, border: `1px solid ${C.goldMid}`,
          borderRadius: 8, color: C.gold, cursor: 'pointer',
          padding: '0 14px', fontFamily: C.sans, fontWeight: 700, fontSize: 13,
        }}>Add</button>
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────
export function EmptyState({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '56px 32px',
      fontFamily: C.sans, display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 38 }}>{icon}</span>
      <span style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>{title}</span>
      <span style={{ color: C.textMut, fontSize: 13, lineHeight: 1.65, maxWidth: 260 }}>{body}</span>
    </div>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────────────
interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  extraAction?: { label: string; onClick: () => void };
}
export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel, extraAction }: ConfirmDialogProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,0.80)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 24, width: '100%', maxWidth: 360,
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <h3 style={{ color: C.text, fontFamily: C.sans, fontSize: 17, fontWeight: 800, marginBottom: 10 }}>{title}</h3>
        <p style={{ color: C.textSub, fontFamily: C.sans, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{message}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {extraAction && (
            <button onClick={extraAction.onClick} style={{
              padding: '11px 0', borderRadius: 9, border: `1px solid ${C.gold}`,
              background: C.goldLo, color: C.gold,
              cursor: 'pointer', fontFamily: C.sans, fontWeight: 700, fontSize: 14,
            }}>{extraAction.label}</button>
          )}
          <button onClick={onConfirm} style={{
            padding: '11px 0', borderRadius: 9, border: 'none',
            background: danger ? C.red : C.accent, color: danger ? '#fff' : '#0D1117',
            cursor: 'pointer', fontFamily: C.sans, fontWeight: 700, fontSize: 14,
          }}>{confirmLabel}</button>
          <button onClick={onCancel} style={{
            padding: '11px 0', borderRadius: 9, border: `1px solid ${C.border}`,
            background: 'transparent', color: C.textSub,
            cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 14,
          }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────
let _toastFn: ((msg: string, type?: 'success' | 'error') => void) | null = null;
export function setToastFn(fn: typeof _toastFn) { _toastFn = fn; }
export function showToast(msg: string, type: 'success' | 'error' = 'success') { _toastFn?.(msg, type); }

export function ToastProvider() {
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: 'success' | 'error' }>>([]);
  const counter = useRef(0);
  useEffect(() => {
    setToastFn((msg, type = 'success') => {
      const id = ++counter.current;
      setToasts(t => [...t, { id, msg, type }]);
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2800);
    });
    return () => setToastFn(null);
  }, []);
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: 16, right: 16,
      zIndex: 500, display: 'flex', flexDirection: 'column', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === 'success' ? '#1A2F1E' : '#2F1A1A',
          border: `1px solid ${t.type === 'success' ? C.green : C.red}`,
          color: t.type === 'success' ? C.green : C.red,
          borderRadius: 10, padding: '12px 16px',
          fontSize: 14, fontFamily: C.sans, fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          animation: 'toastIn 0.22s ease',
        }}>{t.msg}</div>
      ))}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ── Highlight ─────────────────────────────────────────────────────
export function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: C.goldLo, color: C.gold, borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── BottomSheet ───────────────────────────────────────────────────
export function BottomSheet({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: '16px 16px 0 0',
        paddingBottom: 'env(safe-area-inset-bottom, 20px)',
        width: '100%', maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -16px 64px rgba(0,0,0,0.55)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.borderHi }} />
        </div>
        {title && (
          <div style={{
            padding: '4px 16px 12px', flexShrink: 0,
            borderBottom: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ color: C.text, fontFamily: C.sans, fontWeight: 800, fontSize: 17 }}>{title}</span>
            <button onClick={onClose} style={{
              background: 'transparent', border: 'none',
              color: C.textMut, cursor: 'pointer', fontSize: 22, lineHeight: 1,
            }}>×</button>
          </div>
        )}
        <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

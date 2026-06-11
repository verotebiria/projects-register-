import React from 'react';
import { useStore } from '../store';
import { C, STATUS_COLOR, STATUS_BG } from '../utils/tokens';
import type { Page } from '../types';

interface Props { onNavigate: (p: Page) => void; }

function StatCard({ value, label, color, onClick }: { value: number; label: string; color: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: '16px 14px',
      display: 'flex', flexDirection: 'column', gap: 5,
      cursor: onClick ? 'pointer' : 'default',
      textAlign: 'left', flex: 1,
      transition: 'border-color 0.2s, transform 0.15s',
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none'; }}
    >
      <span style={{ fontSize: 30, fontWeight: 800, color, fontFamily: C.sans, letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.textMut, fontFamily: C.sans, textTransform: 'uppercase', letterSpacing: '0.09em' }}>{label}</span>
    </button>
  );
}

export function Dashboard({ onNavigate }: Props) {
  const { projects, accountTypes, emails } = useStore();

  const statusCounts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const recent = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div style={{ padding: '0 0 48px' }}>
      {/* Stat grid */}
      <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard value={projects.length}      label="Total Projects"  color={C.gold}  onClick={() => onNavigate('Projects')} />
          <StatCard value={accountTypes.length}  label="Account Types"  color={C.blue}  onClick={() => onNavigate('Accounts')} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <StatCard value={emails.length}                                    label="Emails"   color={C.purple} onClick={() => onNavigate('Accounts')} />
          <StatCard value={projects.filter(p => p.status === 'Active').length} label="Active" color={C.green}  onClick={() => onNavigate('Projects')} />
        </div>
      </div>

      {/* Status breakdown */}
      {projects.length > 0 && (
        <div style={{ padding: '22px 16px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 10 }}>
            By Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(['Active', 'Development', 'Testing', 'Archived'] as const).map(s => {
              const count = statusCounts[s] ?? 0;
              const pct = projects.length > 0 ? (count / projects.length) * 100 : 0;
              return (
                <div key={s} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <span style={{ color: STATUS_COLOR[s], fontSize: 13, fontWeight: 700, fontFamily: C.sans }}>{s}</span>
                    <span style={{ color: C.textSub, fontSize: 13, fontFamily: C.sans, fontWeight: 600 }}>{count}</span>
                  </div>
                  <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: STATUS_COLOR[s], width: `${pct}%`, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recently updated */}
      {recent.length > 0 && (
        <div style={{ padding: '22px 16px 0' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 10 }}>
            Recently Updated
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recent.map(p => (
              <button key={p.id} onClick={() => onNavigate('Projects')} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 9, padding: '11px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', textAlign: 'left', gap: 10,
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = C.gold)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 700, fontFamily: C.sans, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans }}>{new Date(p.updatedAt).toLocaleDateString()}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: STATUS_COLOR[p.status], background: STATUS_BG[p.status], borderRadius: 4, padding: '3px 7px', fontFamily: C.sans, letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
                  {p.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty call-to-action */}
      {projects.length === 0 && (
        <div style={{ margin: '24px 16px 0', background: C.card, border: `1px dashed ${C.borderHi}`, borderRadius: 14, padding: '36px 24px', textAlign: 'center' }}>
          <img src="/icon_192x192.png" alt="" style={{ width: 56, height: 56, borderRadius: 14, marginBottom: 14 }} />
          <div style={{ color: C.text, fontWeight: 800, fontSize: 17, fontFamily: C.sans, marginBottom: 8 }}>Welcome to Projects Register</div>
          <div style={{ color: C.textMut, fontSize: 13, fontFamily: C.sans, lineHeight: 1.65, marginBottom: 22, maxWidth: 260, margin: '0 auto 22px' }}>
            Start by creating your first project, account type, or email address.
          </div>
          <button onClick={() => onNavigate('Add / Edit')} style={{
            background: C.gold, border: 'none', borderRadius: 9,
            color: '#0D1117', padding: '12px 28px',
            cursor: 'pointer', fontFamily: C.sans, fontWeight: 800, fontSize: 14,
          }}>Get Started</button>
        </div>
      )}
    </div>
  );
}

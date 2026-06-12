import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { SearchBar, EmptyState, ConfirmDialog, Highlight, showToast } from '../components/UI';
import { PageHeader } from '../components/PageHeader';

// ── Account detail — shows all projects + platforms this account is used on
function AccountDetail({ accountId, onBack }: { accountId: string; onBack: ()=>void }) {
  const { accounts, projects, platforms } = useStore();
  const account = accounts.find(a => a.id === accountId);
  if (!account) { onBack(); return null; }

  const linkedProjects = projects.filter(p =>
    p.accounts.some(pa => pa.accountId === accountId)
  );

  return (
    <>
      <PageHeader title={account.value} onBack={onBack} />
      <div style={{ overflowY:'auto', flex:1, padding:'16px 16px 60px' }}>
        {account.label && (
          <div style={{ color:C.textMut, fontSize:13, fontFamily:C.sans, marginBottom:16 }}>{account.label}</div>
        )}

        <div style={{ fontSize:11, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:10 }}>
          Associated Projects & Platforms
        </div>

        {linkedProjects.length === 0 ? (
          <div style={{ color:C.textMut, fontSize:13, fontFamily:C.sans }}>
            Not linked to any project yet.
          </div>
        ) : (
          linkedProjects.map(proj => {
            const usedOnPlatforms = proj.accounts
              .filter(pa => pa.accountId === accountId)
              .map(pa => platforms.find(p => p.id === pa.platformId)?.name)
              .filter(Boolean) as string[];
            return (
              <div key={proj.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px 16px', marginBottom:8 }}>
                <div style={{ color:C.text, fontSize:15, fontWeight:700, fontFamily:C.sans, marginBottom:8 }}>
                  {proj.name}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {usedOnPlatforms.map((name,i) => (
                    <span key={i} style={{ fontSize:11, color:'#7B8FF7', background:'rgba(91,110,245,0.13)', border:'1px solid rgba(91,110,245,0.30)', borderRadius:4, padding:'3px 9px', fontFamily:C.sans, fontWeight:600 }}>
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

// ── Accounts list ─────────────────────────────────────────────────
export function Accounts({ onMenuOpen }: { onMenuOpen: ()=>void }) {
  const { accounts, projects, deleteAccount } = useStore();
  const [query, setQuery]         = useState('');
  const [deleteId, setDeleteId]   = useState<string|null>(null);
  const [selectedId, setSelectedId] = useState<string|null>(null);

  const filtered = useMemo(()=>{
    if (!query.trim()) return accounts;
    const q = query.toLowerCase();
    return accounts.filter(a =>
      a.value.toLowerCase().includes(q) ||
      a.label?.toLowerCase().includes(q)
    );
  },[accounts,query]);

  const target = deleteId ? accounts.find(a=>a.id===deleteId) : null;

  const linkedProjectCount = (id: string) =>
    projects.filter(p => p.accounts.some(pa => pa.accountId===id)).length;

  if (selectedId) {
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
        <AccountDetail accountId={selectedId} onBack={()=>setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Accounts" onMenuOpen={onMenuOpen} />
      <SearchBar value={query} onChange={setQuery} placeholder="Search accounts..." count={filtered.length} total={accounts.length} />
      <div style={{ padding:'12px 16px 80px' }}>
        {accounts.length===0 ? (
          <EmptyState icon="✉️" title="No accounts yet" body="Go to Add / Edit to register email addresses and usernames." />
        ) : filtered.length===0 ? (
          <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}".`} />
        ) : (
          filtered.map(a => {
            const count = linkedProjectCount(a.id);
            return (
              <button key={a.id} onClick={()=>setSelectedId(a.id)}
                style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px 16px', marginBottom:8, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, transition:'border-color 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=C.gold)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=C.border)}
              >
                <div style={{ minWidth:0 }}>
                  <div style={{ color:C.gold, fontSize:14, fontFamily:C.mono, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    <Highlight text={a.value} query={query}/>
                  </div>
                  {a.label && (
                    <div style={{ color:C.textMut, fontSize:11, fontFamily:C.sans, marginTop:2 }}>
                      <Highlight text={a.label} query={query}/>
                    </div>
                  )}
                  <div style={{ color:C.textMut, fontSize:11, fontFamily:C.sans, marginTop:3 }}>
                    {count > 0 ? `${count} project${count!==1?'s':''}` : 'Not linked to any project'}
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMut} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            );
          })
        )}
      </div>

      {target && (
        <ConfirmDialog
          title="Delete Account"
          message={`Delete "${target.value}"? It will be removed from all projects.`}
          confirmLabel="Delete" danger
          onConfirm={()=>{ deleteAccount(target.id); showToast('Account deleted'); setDeleteId(null); }}
          onCancel={()=>setDeleteId(null)}
        />
      )}
    </div>
  );
}

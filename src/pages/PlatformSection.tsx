import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { C, pal } from '../utils/tokens';
import { SearchBar, EmptyState, Highlight, showToast, ConfirmDialog } from '../components/UI';
import { PageHeader } from '../components/PageHeader';

// ── Account detail within a platform ─────────────────────────────
function AccountDetail({ accountId, platformId, onBack }: {
  accountId: string; platformId: string; onBack: ()=>void;
}) {
  const { accounts, projects, platforms } = useStore();
  const account  = accounts.find(a => a.id === accountId);
  const platform = platforms.find(p => p.id === platformId);

  if (!account || !platform) { onBack(); return null; }

  // Find all projects that use this account on any platform
  const linkedProjects = projects.filter(p =>
    p.accounts.some(pa => pa.accountId === accountId)
  );

  // For each linked project, find which platforms this account is used on
  return (
    <>
      <PageHeader title={account.value} onBack={onBack} />
      <div style={{ overflowY:'auto', flex:1, padding:'16px 16px 60px' }}>

        {account.label && (
          <div style={{ color:C.textMut, fontSize:13, fontFamily:C.sans, marginBottom:16 }}>{account.label}</div>
        )}

        <div style={{ fontSize:11, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:10 }}>
          Used in Projects
        </div>

        {linkedProjects.length === 0 ? (
          <div style={{ color:C.textMut, fontSize:13, fontFamily:C.sans }}>Not linked to any project yet.</div>
        ) : (
          linkedProjects.map(proj => {
            // Which platforms in THIS project use this account?
            const usedOnPlatforms = proj.accounts
              .filter(pa => pa.accountId === accountId)
              .map(pa => platforms.find(p => p.id === pa.platformId)?.name)
              .filter(Boolean) as string[];
            return (
              <div key={proj.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px 16px', marginBottom:8 }}>
                <div style={{ color:C.text, fontSize:15, fontWeight:700, fontFamily:C.sans, marginBottom:6 }}>
                  {proj.name}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                  {usedOnPlatforms.map((name,i) => (
                    <span key={i} style={{ fontSize:11, color:pal(i).text, background:pal(i).bg, border:`1px solid ${pal(i).border}`, borderRadius:4, padding:'2px 8px', fontFamily:C.sans, fontWeight:600 }}>
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

// ── Platform section — lists all accounts for one platform ────────
export function PlatformSection({ platformId, onBack }: {
  platformId: string; onBack: ()=>void;
}) {
  const { platforms, accounts, projects } = useStore();
  const platform = platforms.find(p => p.id === platformId);
  const [query, setQuery]           = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string|null>(null);

  if (!platform) { onBack(); return null; }

  // All accounts used with this platform across all projects
  const usedAccountIds = useMemo(()=>{
    const ids = new Set<string>();
    projects.forEach(p => p.accounts.forEach(pa => {
      if (pa.platformId === platformId) ids.add(pa.accountId);
    }));
    return ids;
  },[projects, platformId]);

  const usedAccounts = accounts.filter(a => usedAccountIds.has(a.id));

  const filtered = useMemo(()=>{
    if (!query.trim()) return usedAccounts;
    const q = query.toLowerCase();
    return usedAccounts.filter(a =>
      a.value.toLowerCase().includes(q) ||
      a.label?.toLowerCase().includes(q)
    );
  },[usedAccounts, query]);

  if (selectedAccountId) {
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
        <AccountDetail
          accountId={selectedAccountId}
          platformId={platformId}
          onBack={()=>setSelectedAccountId(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`${platform.name} Accounts`} onBack={onBack} />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={`Search ${platform.name} accounts...`}
        count={filtered.length}
        total={usedAccounts.length}
      />
      <div style={{ padding:'12px 16px 60px' }}>
        {usedAccounts.length === 0 ? (
          <EmptyState icon="✉️" title="No accounts" body={`No accounts have been linked to ${platform.name} in any project yet.`} />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}".`} />
        ) : (
          filtered.map(account => {
            const projectCount = projects.filter(p =>
              p.accounts.some(pa => pa.platformId===platformId && pa.accountId===account.id)
            ).length;
            return (
              <button key={account.id} onClick={()=>setSelectedAccountId(account.id)}
                style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px 16px', marginBottom:8, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, transition:'border-color 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=C.gold)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=C.border)}
              >
                <div style={{ minWidth:0 }}>
                  <div style={{ color:C.gold, fontSize:14, fontFamily:C.mono, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    <Highlight text={account.value} query={query}/>
                  </div>
                  {account.label && (
                    <div style={{ color:C.textMut, fontSize:11, fontFamily:C.sans, marginTop:2 }}>
                      <Highlight text={account.label} query={query}/>
                    </div>
                  )}
                </div>
                <span style={{ color:C.textMut, fontSize:11, fontFamily:C.sans, flexShrink:0 }}>
                  {projectCount} project{projectCount!==1?'s':''}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

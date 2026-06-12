import React, { useState } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { SearchBar, EmptyState, ConfirmDialog, Highlight, showToast } from '../components/UI';
import { PageHeader } from '../components/PageHeader';
import { PlatformSection } from './PlatformSection';

export function Platforms({ onMenuOpen }: { onMenuOpen: ()=>void }) {
  const { platforms, projects, deletePlatform } = useStore();
  const [query, setQuery]         = useState('');
  const [deleteId, setDeleteId]   = useState<string|null>(null);
  const [openPlatformId, setOpenPlatformId] = useState<string|null>(null);

  if (openPlatformId) {
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
        <PlatformSection platformId={openPlatformId} onBack={()=>setOpenPlatformId(null)} />
      </div>
    );
  }

  const filtered = platforms.filter(p =>
    !query.trim() || p.name.toLowerCase().includes(query.toLowerCase())
  );

  const linkedCount = (id: string) =>
    projects.filter(p => p.accounts.some(pa => pa.platformId===id)).length;

  const target = deleteId ? platforms.find(p=>p.id===deleteId) : null;

  return (
    <div>
      <PageHeader title="Platforms" onMenuOpen={onMenuOpen} />
      <SearchBar value={query} onChange={setQuery} placeholder="Search platforms..." count={filtered.length} total={platforms.length} />
      <div style={{ padding:'12px 16px 80px' }}>
        {platforms.length===0 ? (
          <EmptyState icon="🖥️" title="No platforms yet" body="Go to Accounts → Manage to add platforms like GitHub, Vercel, Claude, etc." />
        ) : filtered.length===0 ? (
          <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}".`} />
        ) : (
          filtered.map(p => {
            const count = linkedCount(p.id);
            return (
              <button key={p.id} onClick={()=>setOpenPlatformId(p.id)}
                style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'13px 16px', marginBottom:8, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, transition:'border-color 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=C.gold)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=C.border)}
              >
                <div>
                  <div style={{ color:C.text, fontSize:15, fontWeight:700, fontFamily:C.sans, marginBottom:2 }}>
                    <Highlight text={p.name} query={query}/>
                  </div>
                  <div style={{ color:C.textMut, fontSize:11, fontFamily:C.sans }}>
                    {count > 0 ? `${count} project${count!==1?'s':''}` : 'Not used in any project'}
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
          title="Delete Platform"
          message={`Delete "${target.name}"? It will be removed from all projects.`}
          confirmLabel="Delete" danger
          onConfirm={()=>{ deletePlatform(target.id); showToast('Platform deleted'); setDeleteId(null); }}
          onCancel={()=>setDeleteId(null)}
        />
      )}
    </div>
  );
}

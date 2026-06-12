import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { C, STATUS_COLOR, STATUS_BG, pal } from '../utils/tokens';
import { SearchBar, StatusBadge, EmptyState, ConfirmDialog, showToast, Highlight, TagChip } from '../components/UI';
import { PageHeader } from '../components/PageHeader';
import type { ProjectStatus } from '../types';

const STATUSES: ProjectStatus[] = ['Active','Development','Testing','Archived'];

// ── Project Detail ────────────────────────────────────────────────
function ProjectDetail({ projectId, onBack, onEdit }: {
  projectId: string; onBack: ()=>void; onEdit: ()=>void;
}) {
  const { projects, platforms, accounts, deleteProject } = useStore();
  const project = projects.find(p => p.id === projectId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project) { onBack(); return null; }

  function handleDelete() {
    deleteProject(project!.id);
    showToast('Project deleted');
    onBack();
  }

  return (
    <>
      <PageHeader title={project.name} onBack={onBack} onEdit={onEdit} />

      <div style={{ overflowY:'auto', flex:1, padding:'16px 16px 80px' }}>

        {/* Status */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <StatusBadge status={project.status} />
          <span style={{ color:C.textMut, fontSize:11, fontFamily:C.sans }}>
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p style={{ color:C.textSub, fontSize:14, fontFamily:C.sans, lineHeight:1.65, marginBottom:14, marginTop:0 }}>
            {project.description}
          </p>
        )}

        {/* Notes */}
        {project.notes && (
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:9, padding:'11px 14px', marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:4 }}>Notes</div>
            <p style={{ color:C.textSub, fontSize:13, fontFamily:C.sans, lineHeight:1.65, margin:0 }}>{project.notes}</p>
          </div>
        )}

        {/* Tags */}
        {project.tags.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
            {project.tags.map(t=><TagChip key={t} label={t}/>)}
          </div>
        )}

        {/* ── Platform accounts — THE main section ── */}
        <div style={{ fontSize:11, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:12 }}>
          Platform Accounts
        </div>

        {project.accounts.length === 0 ? (
          <div style={{ background:C.card, border:`1px dashed ${C.borderHi}`, borderRadius:10, padding:'28px 20px', textAlign:'center', marginBottom:24 }}>
            <div style={{ color:C.textMut, fontSize:13, fontFamily:C.sans }}>
              No platforms linked. Tap Edit to add accounts.
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:0, borderRadius:12, overflow:'hidden', border:`1px solid ${C.border}`, marginBottom:24 }}>
            {project.accounts.map((pa, idx) => {
              const platform = platforms.find(p => p.id === pa.platformId);
              const account  = accounts.find(a => a.id === pa.accountId);
              if (!platform) return null;
              const isLast = idx === project.accounts.length - 1;
              return (
                <div key={idx} style={{ background:C.card, borderBottom: isLast ? 'none' : `1px solid ${C.border}`, padding:'13px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  {/* Platform name */}
                  <span style={{ fontSize:14, fontWeight:700, color:C.textSub, fontFamily:C.sans, minWidth:110, flexShrink:0 }}>
                    {platform.name}
                  </span>
                  {/* Account value */}
                  <span style={{ fontSize:13, color:C.gold, fontFamily:C.mono, textAlign:'right', wordBreak:'break-all', flex:1 }}>
                    {account ? account.value : <span style={{ color:C.textMut, fontStyle:'italic', fontFamily:C.sans }}>Not set</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Delete */}
        <button onClick={()=>setConfirmDelete(true)} style={{ width:'100%', padding:'13px 0', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.red, cursor:'pointer', fontFamily:C.sans, fontWeight:700, fontSize:14 }}>
          Delete Project
        </button>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Project"
          message={`Delete "${project.name}"? This cannot be undone.`}
          confirmLabel="Delete" danger
          onConfirm={handleDelete}
          onCancel={()=>setConfirmDelete(false)}
        />
      )}
    </>
  );
}

// ── Projects List ─────────────────────────────────────────────────
export function Projects({ onAddEdit, onMenuOpen }: {
  onAddEdit: (id?: string) => void; onMenuOpen: ()=>void;
}) {
  const { projects, platforms } = useStore();
  const [query, setQuery]               = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus|'All'>('All');
  const [selectedId, setSelectedId]     = useState<string|null>(null);

  const filtered = useMemo(()=>{
    let list = statusFilter==='All' ? projects : projects.filter(p=>p.status===statusFilter);
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags.some(t=>t.toLowerCase().includes(q))
    );
  },[projects,query,statusFilter]);

  // ── Detail view ──────────────────────────────────────────────
  if (selectedId) {
    return (
      <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
        <ProjectDetail
          projectId={selectedId}
          onBack={()=>setSelectedId(null)}
          onEdit={()=>{ const id=selectedId; setSelectedId(null); onAddEdit(id); }}
        />
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────
  return (
    <div>
      <PageHeader title="Projects Register" onMenuOpen={onMenuOpen} />

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search for projects..."
        count={filtered.length}
        total={projects.length}
      />

      {/* Status filter pills */}
      <div style={{ padding:'8px 16px 8px', display:'flex', gap:6, overflowX:'auto', borderBottom:`1px solid ${C.border}` }}>
        {(['All',...STATUSES] as const).map(s=>{
          const active = statusFilter===s;
          const col    = s==='All' ? C.gold : STATUS_COLOR[s];
          const bg     = s==='All' ? C.goldLo : STATUS_BG[s];
          return (
            <button key={s} onClick={()=>setStatusFilter(s)} style={{ flexShrink:0, padding:'5px 12px', borderRadius:20, border:`1px solid ${active?col:C.border}`, background:active?bg:'transparent', color:active?col:C.textMut, fontSize:12, fontWeight:600, fontFamily:C.sans, cursor:'pointer' }}>
              {s}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ padding:'12px 16px 80px' }}>
        {projects.length===0 ? (
          <EmptyState icon="📁" title="No projects yet" body="Tap + to create your first project." />
        ) : filtered.length===0 ? (
          <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}".`} />
        ) : (
          filtered.map(p => {
            const platformNames = p.accounts
              .map(pa => platforms.find(pl=>pl.id===pa.platformId)?.name)
              .filter(Boolean) as string[];
            return (
              <button key={p.id} onClick={()=>setSelectedId(p.id)}
                style={{ width:'100%', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', marginBottom:10, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, transition:'border-color 0.15s' }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor=C.gold)}
                onMouseLeave={e=>(e.currentTarget.style.borderColor=C.border)}
              >
                <div style={{ minWidth:0, flex:1 }}>
                  {/* Name */}
                  <div style={{ color:C.text, fontSize:16, fontWeight:700, fontFamily:C.sans, marginBottom:4 }}>
                    <Highlight text={p.name} query={query}/>
                  </div>
                  {/* Description */}
                  {p.description && (
                    <div style={{ color:C.textMut, fontSize:12, fontFamily:C.sans, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      <Highlight text={p.description} query={query}/>
                    </div>
                  )}
                  {/* Platform chips */}
                  {platformNames.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:4 }}>
                      {platformNames.slice(0,5).map((name,i)=>(
                        <span key={i} style={{ fontSize:11, color:pal(i).text, background:pal(i).bg, border:`1px solid ${pal(i).border}`, borderRadius:4, padding:'2px 8px', fontFamily:C.sans, fontWeight:600 }}>
                          {name}
                        </span>
                      ))}
                      {platformNames.length>5 && <span style={{ fontSize:11, color:C.textMut, fontFamily:C.sans }}>+{platformNames.length-5}</span>}
                    </div>
                  )}
                  {/* Tags */}
                  {p.tags.length > 0 && (
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:6 }}>
                      {p.tags.slice(0,3).map(t=>(
                        <span key={t} style={{ fontSize:10, color:C.blue, background:C.blueLo, borderRadius:4, padding:'2px 6px', fontFamily:C.sans }}>
                          <Highlight text={t} query={query}/>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <StatusBadge status={p.status}/>
              </button>
            );
          })
        )}
      </div>

      {/* FAB */}
      <button onClick={()=>onAddEdit()} style={{ position:'fixed', bottom:26, right:20, width:54, height:54, borderRadius:'50%', background:C.gold, border:'none', boxShadow:`0 4px 20px ${C.goldMid}`, cursor:'pointer', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, color:'#0D1117', lineHeight:1 }}>
        +
      </button>
    </div>
  );
}

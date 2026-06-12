import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { showToast } from '../components/UI';
import type { ProjectStatus } from '../types';

type Tab = 'Project' | 'Platform' | 'Account';
const STATUSES: ProjectStatus[] = ['Active','Development','Testing','Archived'];

const inp: React.CSSProperties = { width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 12px', color:C.text, fontSize:14, fontFamily:C.sans, outline:'none', WebkitAppearance:'none' };
const monoInp: React.CSSProperties = { ...inp, fontFamily:C.mono };
const lbl: React.CSSProperties = { display:'block', fontSize:10, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6, fontFamily:C.sans };

function Field({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={{ marginBottom:16 }}><label style={lbl}>{label}</label>{children}</div>;
}

// ── Project Form ──────────────────────────────────────────────────
function ProjectForm({ editId, onDone }: { editId?:string; onDone:()=>void }) {
  const { projects, platforms, accounts, addProject, updateProject } = useStore();
  const ex = editId ? projects.find(p=>p.id===editId) : null;

  const [name, setName]         = useState(ex?.name ?? '');
  const [desc, setDesc]         = useState(ex?.description ?? '');
  const [status, setStatus]     = useState<ProjectStatus>(ex?.status ?? 'Active');
  const [notes, setNotes]       = useState(ex?.notes ?? '');
  const [tags, setTags]         = useState(ex?.tags.join(', ') ?? '');
  const [rows, setRows]         = useState(ex?.accounts ?? []);

  function addRow()  { setRows(r=>[...r,{platformId:'',accountId:''}]); }
  function rmRow(i:number) { setRows(r=>r.filter((_,j)=>j!==i)); }
  function setRow(i:number, field:'platformId'|'accountId', val:string) {
    setRows(r=>r.map((x,j)=>j===i?{...x,[field]:val}:x));
  }

  function save() {
    if (!name.trim()) { showToast('Project name required','error'); return; }
    const data = {
      name: name.trim(),
      description: desc.trim()||undefined,
      status, notes: notes.trim()||undefined,
      tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      accounts: rows.filter(r=>r.platformId),
    };
    if (editId) { updateProject(editId,data); showToast('Project updated'); }
    else        { addProject(data);           showToast('Project created'); }
    onDone();
  }

  return (
    <div style={{ padding:'16px 16px 48px' }}>
      {editId && <div style={{ background:C.goldLo, border:`1px solid ${C.goldMid}`, borderRadius:8, padding:'9px 12px', marginBottom:16 }}><span style={{ color:C.gold, fontSize:12, fontFamily:C.sans, fontWeight:700 }}>Editing: {ex?.name}</span></div>}

      <Field label="Project Name *"><input value={name} onChange={e=>setName(e.target.value)} placeholder="My Project" style={inp}/></Field>
      <Field label="Description"><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Short description" rows={2} style={{ ...inp, resize:'vertical' as const }}/></Field>
      <Field label="Status">
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {STATUSES.map(s=>(
            <button key={s} onClick={()=>setStatus(s)} style={{ padding:'7px 14px', borderRadius:7, border:`1px solid ${status===s?C.gold:C.border}`, background:status===s?C.goldLo:'transparent', color:status===s?C.gold:C.textMut, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:13 }}>{s}</button>
          ))}
        </div>
      </Field>
      <Field label="Notes"><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Additional notes" rows={2} style={{ ...inp, resize:'vertical' as const }}/></Field>
      <Field label="Tags (comma separated)"><input value={tags} onChange={e=>setTags(e.target.value)} placeholder="e.g. client, web, mobile" style={inp}/></Field>

      {/* Platform + Account rows */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <label style={lbl}>Platform Accounts</label>
          <button onClick={addRow} style={{ background:C.goldLo, border:`1px solid ${C.goldMid}`, borderRadius:7, color:C.gold, cursor:'pointer', padding:'5px 12px', fontFamily:C.sans, fontWeight:700, fontSize:12 }}>+ Add</button>
        </div>

        {platforms.length===0 && (
          <div style={{ background:C.surface, border:`1px dashed ${C.border}`, borderRadius:8, padding:'12px', color:C.textMut, fontSize:12, fontFamily:C.sans }}>
            Add platforms first in Add / Edit → Platform tab.
          </div>
        )}

        {rows.map((row,i)=>(
          <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
              <span style={{ color:C.textSub, fontSize:12, fontWeight:700, fontFamily:C.sans }}>Entry {i+1}</span>
              <button onClick={()=>rmRow(i)} style={{ background:'transparent', border:'none', color:C.red, cursor:'pointer', fontSize:12, fontFamily:C.sans, fontWeight:600 }}>Remove</button>
            </div>
            <div style={{ marginBottom:10 }}>
              <label style={lbl}>Platform</label>
              <select value={row.platformId} onChange={e=>setRow(i,'platformId',e.target.value)} style={{ ...inp, fontFamily:C.sans }}>
                <option value="">— Select platform —</option>
                {platforms.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Account</label>
              <select value={row.accountId} onChange={e=>setRow(i,'accountId',e.target.value)} style={{ ...monoInp, fontSize:13 }}>
                <option value="">— Select account —</option>
                {accounts.map(a=><option key={a.id} value={a.id}>{a.value}{a.label?` (${a.label})`:''}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onDone} style={{ flex:1, padding:'13px 0', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.textSub, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:14 }}>Cancel</button>
        <button onClick={save} style={{ flex:2, padding:'13px 0', borderRadius:9, border:'none', background:C.gold, color:'#0D1117', cursor:'pointer', fontFamily:C.sans, fontWeight:800, fontSize:14 }}>{editId?'Save Changes':'Create Project'}</button>
      </div>
    </div>
  );
}

// ── Platform Form ─────────────────────────────────────────────────
function PlatformForm() {
  const { platforms, addPlatform, updatePlatform, deletePlatform } = useStore();
  const [name, setName]   = useState('');
  const [editId, setEditId] = useState<string|null>(null);

  function save() {
    if (!name.trim()) { showToast('Name required','error'); return; }
    if (editId) { updatePlatform(editId,name.trim()); showToast('Updated'); setEditId(null); }
    else        { addPlatform(name.trim());            showToast('Added'); }
    setName('');
  }

  return (
    <div style={{ padding:'16px 16px 48px' }}>
      <Field label="Platform Name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. GitHub, Claude, Vercel, Firebase" style={inp} onKeyDown={e=>{if(e.key==='Enter')save();}}/></Field>
      <div style={{ display:'flex', gap:10, marginBottom:28 }}>
        {editId && <button onClick={()=>{setEditId(null);setName('');}} style={{ flex:1, padding:'12px 0', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.textSub, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:14 }}>Clear</button>}
        <button onClick={save} style={{ flex:2, padding:'12px 0', borderRadius:9, border:'none', background:C.gold, color:'#0D1117', cursor:'pointer', fontFamily:C.sans, fontWeight:800, fontSize:14 }}>{editId?'Update':'Add Platform'}</button>
      </div>
      {platforms.length===0 && <div style={{ textAlign:'center', padding:'24px 0', color:C.textMut, fontSize:13, fontFamily:C.sans }}>No platforms yet</div>}
      {platforms.map(p=>(
        <div key={p.id} style={{ background:C.card, border:`1px solid ${editId===p.id?C.gold:C.border}`, borderRadius:9, padding:'11px 14px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ color:C.text, fontSize:14, fontFamily:C.sans, fontWeight:600 }}>{p.name}</span>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>{setEditId(p.id);setName(p.name);}} style={{ background:C.goldLo, border:`1px solid ${C.goldMid}`, borderRadius:6, color:C.gold, cursor:'pointer', padding:'5px 12px', fontFamily:C.sans, fontSize:12, fontWeight:700 }}>Edit</button>
            <button onClick={()=>{ deletePlatform(p.id); showToast('Deleted'); }} style={{ background:C.redLo, border:`1px solid rgba(224,82,82,0.3)`, borderRadius:6, color:C.red, cursor:'pointer', padding:'5px 10px', fontFamily:C.sans, fontSize:12, fontWeight:700 }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Account Form ──────────────────────────────────────────────────
function AccountForm() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useStore();
  const [value, setValue]   = useState('');
  const [label, setLabel]   = useState('');
  const [editId, setEditId] = useState<string|null>(null);

  function save() {
    if (!value.trim()) { showToast('Account value required','error'); return; }
    const isDupe = accounts.some(a=>a.value.toLowerCase()===value.trim().toLowerCase()&&a.id!==editId);
    if (isDupe) { showToast('Account already exists','error'); return; }
    if (editId) { updateAccount(editId,value.trim(),label.trim()||undefined); showToast('Updated'); setEditId(null); }
    else        { addAccount(value.trim(),label.trim()||undefined);           showToast('Added'); }
    setValue(''); setLabel('');
  }

  return (
    <div style={{ padding:'16px 16px 48px' }}>
      <Field label="Account (email / username)"><input value={value} onChange={e=>setValue(e.target.value)} placeholder="user@gmail.com or @username" style={monoInp} onKeyDown={e=>{if(e.key==='Enter')save();}}/></Field>
      <Field label="Label (optional)"><input value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Work, Personal" style={inp}/></Field>
      <div style={{ display:'flex', gap:10, marginBottom:28 }}>
        {editId && <button onClick={()=>{setEditId(null);setValue('');setLabel('');}} style={{ flex:1, padding:'12px 0', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.textSub, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:14 }}>Clear</button>}
        <button onClick={save} style={{ flex:2, padding:'12px 0', borderRadius:9, border:'none', background:C.gold, color:'#0D1117', cursor:'pointer', fontFamily:C.sans, fontWeight:800, fontSize:14 }}>{editId?'Update':'Add Account'}</button>
      </div>
      {accounts.length===0 && <div style={{ textAlign:'center', padding:'24px 0', color:C.textMut, fontSize:13, fontFamily:C.sans }}>No accounts yet</div>}
      {accounts.map(a=>(
        <div key={a.id} style={{ background:C.card, border:`1px solid ${editId===a.id?C.gold:C.border}`, borderRadius:9, padding:'11px 14px', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ color:C.gold, fontSize:13, fontFamily:C.mono, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.value}</div>
            {a.label && <div style={{ color:C.textMut, fontSize:11, fontFamily:C.sans }}>{a.label}</div>}
          </div>
          <div style={{ display:'flex', gap:8, flexShrink:0 }}>
            <button onClick={()=>{setEditId(a.id);setValue(a.value);setLabel(a.label??'');}} style={{ background:C.goldLo, border:`1px solid ${C.goldMid}`, borderRadius:6, color:C.gold, cursor:'pointer', padding:'5px 12px', fontFamily:C.sans, fontSize:12, fontWeight:700 }}>Edit</button>
            <button onClick={()=>{ deleteAccount(a.id); showToast('Deleted'); }} style={{ background:C.redLo, border:`1px solid rgba(224,82,82,0.3)`, borderRadius:6, color:C.red, cursor:'pointer', padding:'5px 10px', fontFamily:C.sans, fontSize:12, fontWeight:700 }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AddEdit page ──────────────────────────────────────────────────
export function AddEdit({ editProjectId, onClearEdit, onMenuOpen }: {
  editProjectId?: string; onClearEdit: ()=>void; onMenuOpen: ()=>void;
}) {
  const [tab, setTab] = useState<Tab>(editProjectId?'Project':'Project');
  useEffect(()=>{ if(editProjectId) setTab('Project'); },[editProjectId]);

  return (
    <div>
      <div style={{ position:'sticky', top:0, zIndex:50, background:C.bg, paddingTop:'max(env(safe-area-inset-top),16px)', padding:'max(env(safe-area-inset-top),16px) 16px 0', borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="/icon_192x192.png" alt="" style={{ width:34, height:34, borderRadius:8 }}/>
            <h1 style={{ margin:0, fontSize:19, fontWeight:800, color:C.text, fontFamily:C.sans }}>Add / Edit</h1>
          </div>
          <button onClick={onMenuOpen} style={{ background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, width:40, height:40, cursor:'pointer', flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4.5 }}>
            {[0,1,2].map(i=><span key={i} style={{ display:'block', width:16, height:1.5, background:C.textSub, borderRadius:1 }}/>)}
          </button>
        </div>
        <div style={{ display:'flex', gap:6, paddingBottom:10 }}>
          {(['Project','Platform','Account'] as Tab[]).map(t=>(
            <button key={t} onClick={()=>{setTab(t);if(t!=='Project')onClearEdit();}} style={{ flex:1, padding:'8px 4px', background:tab===t?C.goldLo:'transparent', border:`1px solid ${tab===t?C.gold:C.border}`, borderRadius:8, color:tab===t?C.gold:C.textMut, cursor:'pointer', fontFamily:C.sans, fontWeight:700, fontSize:11, letterSpacing:'0.02em' }}>{t}</button>
          ))}
        </div>
      </div>
      {tab==='Project'  && <ProjectForm  editId={editProjectId} onDone={onClearEdit}/>}
      {tab==='Platform' && <PlatformForm/>}
      {tab==='Account'  && <AccountForm/>}
    </div>
  );
}

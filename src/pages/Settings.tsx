import React, { useRef, useState } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { showToast, ConfirmDialog } from '../components/UI';
import { PageHeader } from '../components/PageHeader';

export function Settings({ onMenuOpen }: { onMenuOpen: ()=>void }) {
  const { exportBackup, importBackup, clearAll, projects, platforms, accounts } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmImport, setConfirmImport] = useState<string|null>(null);
  const [confirmClear,  setConfirmClear]  = useState(false);

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type:'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `projects-register-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported');
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setConfirmImport(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = '';
  }

  function Row({ label, value }: { label:string; value:string|number }) {
    return (
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:`1px solid ${C.border}` }}>
        <span style={{ color:C.textSub, fontSize:14, fontFamily:C.sans }}>{label}</span>
        <span style={{ color:C.text,    fontSize:14, fontFamily:C.sans, fontWeight:600 }}>{value}</span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" onMenuOpen={onMenuOpen} />
      <div style={{ padding:'16px 16px 60px' }}>

        {/* Identity card */}
        <div style={{ display:'flex', alignItems:'center', gap:14, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:24 }}>
          <img src="/icon_192x192.png" alt="" style={{ width:52, height:52, borderRadius:12, flexShrink:0 }}/>
          <div>
            <div style={{ color:C.text, fontSize:16, fontWeight:800, fontFamily:C.sans }}>Projects Register</div>
            <div style={{ color:C.textMut, fontSize:12, fontFamily:C.sans, marginTop:2 }}>Version 1.0.0 · Android</div>
          </div>
        </div>

        {/* Data summary */}
        <div style={{ fontSize:10, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:10 }}>Data</div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'0 16px', marginBottom:24 }}>
          <Row label="Projects"  value={projects.length}  />
          <Row label="Platforms" value={platforms.length} />
          <Row label="Accounts"  value={accounts.length}  />
        </div>

        {/* Backup */}
        <div style={{ fontSize:10, fontWeight:700, color:C.textMut, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:10 }}>Backup & Restore</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
          <button onClick={handleExport} style={{ padding:'13px 16px', borderRadius:10, border:`1px solid ${C.border}`, background:C.card, color:C.text, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:14, textAlign:'left', display:'flex', justifyContent:'space-between' }}>
            <span>Export Backup</span><span style={{ color:C.textMut, fontSize:12 }}>JSON ↓</span>
          </button>
          <button onClick={()=>fileRef.current?.click()} style={{ padding:'13px 16px', borderRadius:10, border:`1px solid ${C.border}`, background:C.card, color:C.text, cursor:'pointer', fontFamily:C.sans, fontWeight:600, fontSize:14, textAlign:'left', display:'flex', justifyContent:'space-between' }}>
            <span>Import Backup</span><span style={{ color:C.textMut, fontSize:12 }}>JSON ↑</span>
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display:'none' }}/>
        </div>

        {/* Danger */}
        <div style={{ fontSize:10, fontWeight:700, color:C.red, letterSpacing:'0.1em', textTransform:'uppercase' as const, fontFamily:C.sans, marginBottom:10 }}>Danger Zone</div>
        <button onClick={()=>setConfirmClear(true)} style={{ width:'100%', padding:'13px 16px', borderRadius:10, border:`1px solid ${C.red}`, background:C.redLo, color:C.red, cursor:'pointer', fontFamily:C.sans, fontWeight:700, fontSize:14, textAlign:'left' }}>
          Clear All Data
        </button>

        {confirmImport && (
          <ConfirmDialog title="Import Backup" message="This will replace all current data. Continue?"
            confirmLabel="Import"
            onConfirm={()=>{ const ok=importBackup(confirmImport); showToast(ok?'Imported':'Invalid file',ok?'success':'error'); setConfirmImport(null); }}
            onCancel={()=>setConfirmImport(null)}/>
        )}
        {confirmClear && (
          <ConfirmDialog title="Clear All Data" message="Permanently delete all projects, platforms and accounts? Cannot be undone."
            confirmLabel="Delete Everything" danger
            onConfirm={()=>{ clearAll(); showToast('All data cleared'); setConfirmClear(false); }}
            onCancel={()=>setConfirmClear(false)}/>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { showToast, ConfirmDialog } from '../components/UI';

export function Settings() {
  const { exportBackup, importBackup, clearAll, projects, accountTypes, emails } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmImport, setConfirmImport] = useState<string | null>(null);
  const [confirmClear, setConfirmClear]   = useState(false);

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `projects-register-backup-${date}.json`;
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

  function doImport() {
    if (!confirmImport) return;
    const ok = importBackup(confirmImport);
    showToast(ok ? 'Backup imported successfully' : 'Invalid backup file', ok ? 'success' : 'error');
    setConfirmImport(null);
  }

  function Row({ label, value }: { label: string; value: string | number }) {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
        <span style={{ color: C.textSub, fontSize: 14, fontFamily: C.sans }}>{label}</span>
        <span style={{ color: C.text, fontSize: 14, fontFamily: C.sans, fontWeight: 600 }}>{value}</span>
      </div>
    );
  }

  function SectionTitle({ label }: { label: string }) {
    return (
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 10 }}>
        {label}
      </div>
    );
  }

  function ActionCard({ label, sub, onClick, danger }: { label: string; sub: string; onClick: () => void; danger?: boolean }) {
    return (
      <button onClick={onClick} style={{
        width: '100%', padding: '14px 16px', borderRadius: 10,
        border: `1px solid ${danger ? C.red : C.border}`,
        background: danger ? C.redLo : C.card,
        color: danger ? C.red : C.text,
        cursor: 'pointer', fontFamily: C.sans,
        fontWeight: 600, fontSize: 14, textAlign: 'left',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'border-color 0.15s',
        marginBottom: 10,
      }}>
        <span>{label}</span>
        <span style={{ color: danger ? C.red : C.textMut, fontSize: 12 }}>{sub}</span>
      </button>
    );
  }

  return (
    <div style={{ padding: '16px 16px 60px' }}>

      {/* App identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px', marginBottom: 24 }}>
        <img src="/icon_192x192.png" alt="Projects Register" style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0 }} />
        <div>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 800, fontFamily: C.sans, letterSpacing: '-0.02em' }}>Projects Register</div>
          <div style={{ color: C.textMut, fontSize: 12, fontFamily: C.sans, marginTop: 2 }}>Version 1.0.0 · Android</div>
        </div>
      </div>

      {/* Data summary */}
      <div style={{ marginBottom: 24 }}>
        <SectionTitle label="Data Summary" />
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0 16px' }}>
          <Row label="Projects"      value={projects.length} />
          <Row label="Account Types" value={accountTypes.length} />
          <Row label="Emails"        value={emails.length} />
        </div>
      </div>

      {/* Backup */}
      <div style={{ marginBottom: 24 }}>
        <SectionTitle label="Backup & Restore" />
        <ActionCard label="Export Backup" sub="JSON ↓" onClick={handleExport} />
        <ActionCard label="Import Backup" sub="JSON ↑" onClick={() => fileRef.current?.click()} />
        <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display: 'none' }} />
        <p style={{ color: C.textMut, fontSize: 12, fontFamily: C.sans, lineHeight: 1.6, marginTop: 4 }}>
          Backups are stored as JSON files. Importing will replace all current data.
        </p>
      </div>

      {/* Storage */}
      <div style={{ marginBottom: 24 }}>
        <SectionTitle label="Storage" />
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0 16px' }}>
          <Row label="Engine"   value="Capacitor Preferences" />
          <Row label="Location" value="Device local storage" />
          <Row label="Sync"     value="None — offline only" />
        </div>
      </div>

      {/* Danger zone */}
      <div>
        <SectionTitle label="Danger Zone" />
        <ActionCard label="Clear All Data" sub="Cannot be undone" onClick={() => setConfirmClear(true)} danger />
      </div>

      {confirmImport !== null && (
        <ConfirmDialog
          title="Import Backup"
          message="This will replace ALL current data with the backup. Are you sure?"
          confirmLabel="Import & Replace"
          onConfirm={doImport}
          onCancel={() => setConfirmImport(null)}
        />
      )}

      {confirmClear && (
        <ConfirmDialog
          title="Clear All Data"
          message="This will permanently delete all projects, account types, and emails. This cannot be undone."
          confirmLabel="Delete Everything"
          danger
          onConfirm={() => { clearAll(); showToast('All data cleared'); setConfirmClear(false); }}
          onCancel={() => setConfirmClear(false)}
        />
      )}
    </div>
  );
}

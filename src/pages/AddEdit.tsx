import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { TagInput, showToast } from '../components/UI';
import type { ProjectStatus, ProjectResources } from '../types';

type Section = 'Project' | 'Account Type' | 'Email';
const STATUSES: ProjectStatus[] = ['Active', 'Development', 'Testing', 'Archived'];

const inputStyle: React.CSSProperties = {
  width: '100%', background: C.bg,
  border: `1px solid ${C.border}`, borderRadius: 8,
  padding: '10px 12px', color: C.text, fontSize: 14,
  fontFamily: C.sans, outline: 'none', WebkitAppearance: 'none',
};
const monoInput: React.CSSProperties = { ...inputStyle, fontFamily: C.mono };
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700,
  color: C.textMut, letterSpacing: '0.1em',
  textTransform: 'uppercase', marginBottom: 6, fontFamily: C.sans,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

// ── Project Form ──────────────────────────────────────────────────
function ProjectForm({ editId, onDone }: { editId?: string; onDone: () => void }) {
  const { projects, accountTypes, emails, addProject, updateProject } = useStore();
  const existing = editId ? projects.find(p => p.id === editId) : null;

  const [name, setName]             = useState(existing?.name ?? '');
  const [description, setDesc]      = useState(existing?.description ?? '');
  const [status, setStatus]         = useState<ProjectStatus>(existing?.status ?? 'Active');
  const [notes, setNotes]           = useState(existing?.notes ?? '');
  const [tags, setTags]             = useState<string[]>(existing?.tags ?? []);
  const [linkedATs, setLinkedATs]   = useState<string[]>(existing?.linkedAccountTypeIds ?? []);
  const [linkedEmails, setLinkedEmails] = useState<string[]>(existing?.linkedEmailIds ?? []);
  const [resources, setResources]   = useState<ProjectResources>(existing?.resources ?? {});
  const [showRes, setShowRes]       = useState(false);

  function toggleAT(id: string) { setLinkedATs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }
  function toggleEmail(id: string) { setLinkedEmails(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); }
  function setRes(key: keyof ProjectResources, val: string) { setResources(r => ({ ...r, [key]: val || undefined })); }

  function save() {
    if (!name.trim()) { showToast('Project name is required', 'error'); return; }
    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      status, notes: notes.trim() || undefined, tags, resources,
      linkedAccountTypeIds: linkedATs, linkedEmailIds: linkedEmails,
    };
    if (editId) { updateProject(editId, data); showToast('Project updated'); }
    else { addProject(data); showToast('Project created'); }
    onDone();
  }

  const RESOURCE_FIELDS: [keyof ProjectResources, string][] = [
    ['repositoryUrl',    'Repository URL'],
    ['websiteUrl',       'Website URL'],
    ['domainName',       'Domain Name'],
    ['hostingProvider',  'Hosting Provider'],
    ['firebaseProjectId','Firebase Project ID'],
    ['vercelProject',    'Vercel Project'],
    ['mapboxProject',    'Mapbox Project'],
    ['sanityDataset',    'Sanity Dataset'],
    ['customNotes',      'Custom Notes'],
  ];

  return (
    <div style={{ padding: '16px 16px 48px' }}>
      {editId && (
        <div style={{ background: C.goldLo, border: `1px solid ${C.goldMid}`, borderRadius: 8, padding: '9px 12px', marginBottom: 16 }}>
          <span style={{ color: C.gold, fontSize: 12, fontFamily: C.sans, fontWeight: 700 }}>
            ✎  Editing: {existing?.name}
          </span>
        </div>
      )}

      <Field label="Project Name *">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="My Project" style={inputStyle} />
      </Field>

      <Field label="Description">
        <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="What is this project?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </Field>

      <Field label="Status">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)} style={{
              padding: '7px 14px', borderRadius: 7,
              border: `1px solid ${status === s ? C.gold : C.border}`,
              background: status === s ? C.goldLo : 'transparent',
              color: status === s ? C.gold : C.textMut,
              cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 13,
              transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </Field>

      <Field label="Notes">
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes…" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
      </Field>

      <Field label="Tags">
        <TagInput tags={tags} onChange={setTags} />
      </Field>

      {accountTypes.length > 0 && (
        <Field label="Link Account Types">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {accountTypes.map(at => (
              <button key={at.id} onClick={() => toggleAT(at.id)} style={{
                padding: '6px 12px', borderRadius: 7,
                border: `1px solid ${linkedATs.includes(at.id) ? C.blue : C.border}`,
                background: linkedATs.includes(at.id) ? C.blueLo : 'transparent',
                color: linkedATs.includes(at.id) ? C.blue : C.textMut,
                cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 12,
                transition: 'all 0.15s',
              }}>{at.name}</button>
            ))}
          </div>
        </Field>
      )}

      {emails.length > 0 && (
        <Field label="Link Emails">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {emails.map(em => (
              <button key={em.id} onClick={() => toggleEmail(em.id)} style={{
                padding: '9px 12px', borderRadius: 7, textAlign: 'left',
                border: `1px solid ${linkedEmails.includes(em.id) ? C.gold : C.border}`,
                background: linkedEmails.includes(em.id) ? C.goldLo : 'transparent',
                color: linkedEmails.includes(em.id) ? C.gold : C.textMut,
                cursor: 'pointer', fontFamily: C.mono, fontSize: 12,
                transition: 'all 0.15s',
              }}>
                {em.address}{em.label ? ` — ${em.label}` : ''}
              </button>
            ))}
          </div>
        </Field>
      )}

      {/* Resources collapsible */}
      <button onClick={() => setShowRes(r => !r)} style={{
        width: '100%', padding: '10px 14px',
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 8, color: C.textSub,
        cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 13,
        textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: showRes ? 12 : 20,
        transition: 'background 0.15s',
      }}>
        <span>Project Resources</span>
        <span style={{ fontSize: 12, color: C.textMut, display: 'flex', alignItems: 'center', gap: 8 }}>
          {Object.values(resources).filter(Boolean).length > 0 && (
            <span style={{ background: C.goldLo, color: C.gold, borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>
              {Object.values(resources).filter(Boolean).length} filled
            </span>
          )}
          <span style={{ transition: 'transform 0.2s', transform: showRes ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
        </span>
      </button>

      {showRes && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {RESOURCE_FIELDS.map(([key, label]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input value={resources[key] ?? ''} onChange={e => setRes(key, e.target.value)} placeholder={label} style={key === 'hostingProvider' || key === 'customNotes' ? inputStyle : monoInput} />
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onDone} style={{
          flex: 1, padding: '13px 0', borderRadius: 9,
          border: `1px solid ${C.border}`, background: 'transparent',
          color: C.textSub, cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 14,
        }}>Cancel</button>
        <button onClick={save} style={{
          flex: 2, padding: '13px 0', borderRadius: 9,
          border: 'none', background: C.gold, color: '#0D1117',
          cursor: 'pointer', fontFamily: C.sans, fontWeight: 800, fontSize: 14,
        }}>{editId ? 'Save Changes' : 'Create Project'}</button>
      </div>
    </div>
  );
}

// ── Account Type Form ─────────────────────────────────────────────
function AccountTypeForm() {
  const { accountTypes, addAccountType, updateAccountType } = useStore();
  const [name, setName]     = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  function save() {
    if (!name.trim()) { showToast('Name required', 'error'); return; }
    if (editId) { updateAccountType(editId, name.trim()); showToast('Account type updated'); setEditId(null); }
    else { addAccountType(name.trim()); showToast('Account type added'); }
    setName('');
  }

  return (
    <div style={{ padding: '16px 16px 48px' }}>
      <Field label="Account Type Name">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. GitHub, Firebase, Vercel" style={inputStyle}
          onKeyDown={e => { if (e.key === 'Enter') save(); }} />
      </Field>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {editId && (
          <button onClick={() => { setEditId(null); setName(''); }} style={{
            flex: 1, padding: '12px 0', borderRadius: 9,
            border: `1px solid ${C.border}`, background: 'transparent',
            color: C.textSub, cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 14,
          }}>Clear</button>
        )}
        <button onClick={save} style={{
          flex: 2, padding: '12px 0', borderRadius: 9,
          border: 'none', background: C.gold, color: '#0D1117',
          cursor: 'pointer', fontFamily: C.sans, fontWeight: 800, fontSize: 14,
        }}>{editId ? 'Update' : 'Add Account Type'}</button>
      </div>

      {accountTypes.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 10 }}>
            Existing ({accountTypes.length})
          </div>
          {accountTypes.map(at => (
            <div key={at.id} style={{
              background: C.card, border: `1px solid ${editId === at.id ? C.gold : C.border}`,
              borderRadius: 9, padding: '11px 14px', marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ color: C.text, fontSize: 14, fontFamily: C.sans, fontWeight: 600 }}>{at.name}</span>
              <button onClick={() => { setEditId(at.id); setName(at.name); }} style={{
                background: C.goldLo, border: `1px solid ${C.goldMid}`,
                borderRadius: 6, color: C.gold, cursor: 'pointer',
                padding: '5px 12px', fontFamily: C.sans, fontSize: 12, fontWeight: 700,
              }}>Edit</button>
            </div>
          ))}
        </>
      )}

      {accountTypes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMut, fontSize: 13, fontFamily: C.sans }}>
          No account types yet — add your first above
        </div>
      )}
    </div>
  );
}

// ── Email Form ────────────────────────────────────────────────────
function EmailForm() {
  const { emails, addEmail, updateEmail } = useStore();
  const [address, setAddress] = useState('');
  const [label, setLabel]     = useState('');
  const [editId, setEditId]   = useState<string | null>(null);

  function save() {
    if (!address.trim()) { showToast('Email address required', 'error'); return; }
    const isDupe = emails.some(e => e.address.toLowerCase() === address.trim().toLowerCase() && e.id !== editId);
    if (isDupe) { showToast('Email already exists', 'error'); return; }
    if (editId) { updateEmail(editId, address.trim(), label.trim() || undefined); showToast('Email updated'); setEditId(null); }
    else { addEmail(address.trim(), label.trim() || undefined); showToast('Email added'); }
    setAddress(''); setLabel('');
  }

  return (
    <div style={{ padding: '16px 16px 48px' }}>
      <Field label="Email Address">
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="user@example.com" style={monoInput}
          onKeyDown={e => { if (e.key === 'Enter') save(); }} />
      </Field>
      <Field label="Label (optional)">
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Work, Personal, Client" style={inputStyle} />
      </Field>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {editId && (
          <button onClick={() => { setEditId(null); setAddress(''); setLabel(''); }} style={{
            flex: 1, padding: '12px 0', borderRadius: 9,
            border: `1px solid ${C.border}`, background: 'transparent',
            color: C.textSub, cursor: 'pointer', fontFamily: C.sans, fontWeight: 600, fontSize: 14,
          }}>Clear</button>
        )}
        <button onClick={save} style={{
          flex: 2, padding: '12px 0', borderRadius: 9,
          border: 'none', background: C.gold, color: '#0D1117',
          cursor: 'pointer', fontFamily: C.sans, fontWeight: 800, fontSize: 14,
        }}>{editId ? 'Update' : 'Add Email'}</button>
      </div>

      {emails.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 10 }}>
            Registered Emails ({emails.length})
          </div>
          {emails.map(em => (
            <div key={em.id} style={{
              background: C.card, border: `1px solid ${editId === em.id ? C.gold : C.border}`,
              borderRadius: 9, padding: '11px 14px', marginBottom: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.gold, fontSize: 13, fontFamily: C.mono, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{em.address}</div>
                {em.label && <div style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans, marginTop: 2 }}>{em.label}</div>}
              </div>
              <button onClick={() => { setEditId(em.id); setAddress(em.address); setLabel(em.label ?? ''); }} style={{
                background: C.goldLo, border: `1px solid ${C.goldMid}`,
                borderRadius: 6, color: C.gold, flexShrink: 0,
                cursor: 'pointer', padding: '5px 12px',
                fontFamily: C.sans, fontSize: 12, fontWeight: 700,
              }}>Edit</button>
            </div>
          ))}
        </>
      )}

      {emails.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: C.textMut, fontSize: 13, fontFamily: C.sans }}>
          No emails yet — add your first above
        </div>
      )}
    </div>
  );
}

// ── AddEdit page ──────────────────────────────────────────────────
interface Props {
  editProjectId?: string;
  onClearEdit: () => void;
}

export function AddEdit({ editProjectId, onClearEdit }: Props) {
  const [section, setSection] = useState<Section>(editProjectId ? 'Project' : 'Project');

  useEffect(() => { if (editProjectId) setSection('Project'); }, [editProjectId]);

  return (
    <div>
      {/* Section tabs — sticky below header */}
      <div style={{
        padding: '10px 16px 10px',
        position: 'sticky', top: 72, zIndex: 39, background: C.bg,
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['Project', 'Account Type', 'Email'] as Section[]).map(s => (
            <button key={s} onClick={() => { setSection(s); if (s !== 'Project') onClearEdit(); }} style={{
              flex: 1, padding: '8px 4px',
              background: section === s ? C.goldLo : 'transparent',
              border: `1px solid ${section === s ? C.gold : C.border}`,
              borderRadius: 8,
              color: section === s ? C.gold : C.textMut,
              cursor: 'pointer', fontFamily: C.sans, fontWeight: 700, fontSize: 11,
              letterSpacing: '0.02em', transition: 'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {section === 'Project'      && <ProjectForm editId={editProjectId} onDone={onClearEdit} />}
      {section === 'Account Type' && <AccountTypeForm />}
      {section === 'Email'        && <EmailForm />}
    </div>
  );
}

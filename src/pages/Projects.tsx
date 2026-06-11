import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { C, STATUS_COLOR, STATUS_BG } from '../utils/tokens';
import { SearchBar, StatusBadge, Tag, EmptyState, ConfirmDialog, BottomSheet, Highlight, showToast } from '../components/UI';
import type { ProjectStatus } from '../types';

const STATUSES: ProjectStatus[] = ['Active', 'Development', 'Testing', 'Archived'];

function ResourceRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 3 }}>{label}</div>
      <div style={{ color: C.text, fontSize: 13, fontFamily: C.mono, wordBreak: 'break-all', lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function ProjectDetail({ projectId, onClose, onEdit }: { projectId: string; onClose: () => void; onEdit: () => void }) {
  const { projects, accountTypes, emails, deleteProject } = useStore();
  const project = projects.find(p => p.id === projectId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!project) { onClose(); return null; }

  const linkedATs     = accountTypes.filter(a => project.linkedAccountTypeIds.includes(a.id));
  const linkedEmails  = emails.filter(e => project.linkedEmailIds.includes(e.id));
  const hasResources  = Object.values(project.resources).some(Boolean);

  function handleDelete() {
    deleteProject(project!.id);
    showToast('Project deleted');
    onClose();
  }

  return (
    <>
      <BottomSheet onClose={onClose} title={project.name}>
        <div style={{ padding: '16px 16px 36px' }}>

          {/* Status + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <StatusBadge status={project.status} />
            <span style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans }}>
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Description */}
          {project.description && (
            <Section label="Description">
              <p style={{ color: C.textSub, fontSize: 14, fontFamily: C.sans, lineHeight: 1.65, margin: 0 }}>{project.description}</p>
            </Section>
          )}

          {/* Notes */}
          {project.notes && (
            <Section label="Notes">
              <p style={{ color: C.textSub, fontSize: 14, fontFamily: C.sans, lineHeight: 1.65, margin: 0 }}>{project.notes}</p>
            </Section>
          )}

          {/* Tags */}
          {project.tags.length > 0 && (
            <Section label="Tags">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {project.tags.map(t => <Tag key={t} label={t} />)}
              </div>
            </Section>
          )}

          {/* Account types */}
          {linkedATs.length > 0 && (
            <Section label="Account Types">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {linkedATs.map(a => (
                  <span key={a.id} style={{ fontSize: 12, color: C.blue, background: C.blueLo, border: `1px solid ${C.navyLo}`, borderRadius: 5, padding: '3px 8px', fontFamily: C.sans, fontWeight: 600 }}>
                    {a.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Emails */}
          {linkedEmails.length > 0 && (
            <Section label="Emails">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {linkedEmails.map(e => (
                  <span key={e.id} style={{ fontSize: 13, color: C.gold, fontFamily: C.mono }}>{e.address}</span>
                ))}
              </div>
            </Section>
          )}

          {/* Resources */}
          {hasResources && (
            <Section label="Resources">
              <div style={{ background: C.bg, borderRadius: 9, padding: '12px 14px', border: `1px solid ${C.border}` }}>
                <ResourceRow label="Repository"     value={project.resources.repositoryUrl} />
                <ResourceRow label="Website"        value={project.resources.websiteUrl} />
                <ResourceRow label="Domain"         value={project.resources.domainName} />
                <ResourceRow label="Hosting"        value={project.resources.hostingProvider} />
                <ResourceRow label="Firebase ID"    value={project.resources.firebaseProjectId} />
                <ResourceRow label="Vercel Project" value={project.resources.vercelProject} />
                <ResourceRow label="Mapbox Project" value={project.resources.mapboxProject} />
                <ResourceRow label="Sanity Dataset" value={project.resources.sanityDataset} />
                <ResourceRow label="Custom Notes"   value={project.resources.customNotes} />
              </div>
            </Section>
          )}

          {/* Dates */}
          <div style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans, lineHeight: 1.9, marginBottom: 22 }}>
            Created: {new Date(project.createdAt).toLocaleString()}<br />
            Updated: {new Date(project.updatedAt).toLocaleString()}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onEdit} style={{
              flex: 1, padding: '13px 0', borderRadius: 9,
              border: 'none', background: C.gold, color: '#0D1117',
              cursor: 'pointer', fontFamily: C.sans, fontWeight: 800, fontSize: 14,
            }}>Edit Project</button>
            <button onClick={() => setConfirmDelete(true)} style={{
              padding: '13px 18px', borderRadius: 9,
              border: `1px solid ${C.border}`, background: 'transparent', color: C.red,
              cursor: 'pointer', fontFamily: C.sans, fontWeight: 700, fontSize: 14,
            }}>Delete</button>
          </div>
        </div>
      </BottomSheet>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Project"
          message={`Delete "${project.name}"? This cannot be undone.`}
          confirmLabel="Delete" danger
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: C.textMut, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: C.sans, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

export function Projects({ onAddEdit }: { onAddEdit: (id?: string) => void }) {
  const { projects } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = statusFilter === 'All' ? projects : projects.filter(p => p.status === statusFilter);
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.notes?.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [projects, query, statusFilter]);

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} placeholder="Search projects…" count={filtered.length} total={projects.length} />

      {/* Status filter pills */}
      <div style={{ padding: '10px 16px 12px', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: `1px solid ${C.border}` }}>
        {(['All', ...STATUSES] as const).map(s => {
          const isActive = statusFilter === s;
          const col = s === 'All' ? C.gold : STATUS_COLOR[s];
          const bg  = s === 'All' ? C.goldLo : STATUS_BG[s];
          return (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              flexShrink: 0, padding: '5px 12px', borderRadius: 20,
              border: `1px solid ${isActive ? col : C.border}`,
              background: isActive ? bg : 'transparent',
              color: isActive ? col : C.textMut,
              fontSize: 12, fontWeight: 600, fontFamily: C.sans, cursor: 'pointer',
              transition: 'all 0.15s',
            }}>{s}</button>
          );
        })}
      </div>

      {/* List */}
      <div style={{ padding: '12px 16px 80px' }}>
        {projects.length === 0 ? (
          <EmptyState icon="📁" title="No projects yet" body="Tap the + button or go to Add / Edit to create your first project." />
        ) : filtered.length === 0 ? (
          <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}"${statusFilter !== 'All' ? ` with status "${statusFilter}"` : ''}.`} />
        ) : (
          filtered.map(p => (
            <button key={p.id} onClick={() => setSelectedId(p.id)} style={{
              width: '100%', background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10, padding: '13px 14px',
              marginBottom: 8, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = C.gold)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: C.text, fontSize: 15, fontWeight: 700, fontFamily: C.sans, marginBottom: 3 }}>
                  <Highlight text={p.name} query={query} />
                </div>
                {p.description && (
                  <div style={{ color: C.textMut, fontSize: 12, fontFamily: C.sans, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Highlight text={p.description} query={query} />
                  </div>
                )}
                {p.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                    {p.tags.slice(0, 3).map(t => (
                      <span key={t} style={{ fontSize: 10, color: C.blue, background: C.blueLo, borderRadius: 4, padding: '2px 6px', fontFamily: C.sans }}>
                        <Highlight text={t} query={query} />
                      </span>
                    ))}
                    {p.tags.length > 3 && <span style={{ fontSize: 10, color: C.textMut, fontFamily: C.sans }}>+{p.tags.length - 3}</span>}
                  </div>
                )}
              </div>
              <StatusBadge status={p.status} />
            </button>
          ))
        )}
      </div>

      {/* FAB */}
      <button onClick={() => onAddEdit()} style={{
        position: 'fixed', bottom: 26, right: 20,
        width: 52, height: 52, borderRadius: '50%',
        background: C.gold, border: 'none',
        boxShadow: `0 4px 20px ${C.goldMid}`,
        cursor: 'pointer', zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 26, color: '#0D1117', fontWeight: 300, lineHeight: 1,
      }}>+</button>

      {selectedId && (
        <ProjectDetail
          projectId={selectedId}
          onClose={() => setSelectedId(null)}
          onEdit={() => { const id = selectedId; setSelectedId(null); onAddEdit(id); }}
        />
      )}
    </div>
  );
}

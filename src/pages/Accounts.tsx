import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { C } from '../utils/tokens';
import { SearchBar, EmptyState, ConfirmDialog, Highlight, showToast } from '../components/UI';

type Tab = 'Types' | 'Emails';

export function Accounts() {
  const { accountTypes, emails, projects, deleteAccountType, deleteEmail } = useStore();
  const [tab, setTab]             = useState<Tab>('Types');
  const [query, setQuery]         = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; kind: 'type' | 'email'; name: string } | null>(null);

  const filteredTypes = useMemo(() => {
    if (!query.trim()) return accountTypes;
    const q = query.toLowerCase();
    return accountTypes.filter(a => a.name.toLowerCase().includes(q));
  }, [accountTypes, query]);

  const filteredEmails = useMemo(() => {
    if (!query.trim()) return emails;
    const q = query.toLowerCase();
    return emails.filter(e => e.address.toLowerCase().includes(q) || e.label?.toLowerCase().includes(q));
  }, [emails, query]);

  function linkedCount(id: string, kind: 'type' | 'email') {
    return kind === 'type'
      ? projects.filter(p => p.linkedAccountTypeIds.includes(id)).length
      : projects.filter(p => p.linkedEmailIds.includes(id)).length;
  }

  function confirmDelete(removeLinks: boolean) {
    if (!deleteTarget) return;
    if (deleteTarget.kind === 'type') { deleteAccountType(deleteTarget.id, removeLinks); showToast('Account type deleted'); }
    else { deleteEmail(deleteTarget.id, removeLinks); showToast('Email deleted'); }
    setDeleteTarget(null);
  }

  const hasLinks = deleteTarget ? linkedCount(deleteTarget.id, deleteTarget.kind) > 0 : false;
  const linkCount = deleteTarget ? linkedCount(deleteTarget.id, deleteTarget.kind) : 0;

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={tab === 'Types' ? 'Search account types…' : 'Search emails…'}
        count={tab === 'Types' ? filteredTypes.length : filteredEmails.length}
        total={tab === 'Types' ? accountTypes.length : emails.length}
      />

      {/* Tab bar */}
      <div style={{
        display: 'flex', padding: '10px 16px 12px', gap: 0,
        position: 'sticky', top: 111, zIndex: 39, background: C.bg,
        borderBottom: `1px solid ${C.border}`,
      }}>
        {(['Types', 'Emails'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '9px 0',
            background: tab === t ? C.goldLo : 'transparent',
            border: `1px solid ${tab === t ? C.gold : C.border}`,
            borderRadius: t === 'Types' ? '8px 0 0 8px' : '0 8px 8px 0',
            color: tab === t ? C.gold : C.textMut,
            cursor: 'pointer', fontFamily: C.sans, fontWeight: 700, fontSize: 13,
            transition: 'all 0.15s',
          }}>
            {t}
            <span style={{
              marginLeft: 6, fontSize: 11,
              color: tab === t ? C.gold : C.textMut,
              background: tab === t ? C.goldMid : 'rgba(74,79,99,0.12)',
              borderRadius: 4, padding: '1px 5px',
            }}>
              {t === 'Types' ? accountTypes.length : emails.length}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 16px 80px' }}>
        {tab === 'Types' ? (
          accountTypes.length === 0 ? (
            <EmptyState icon="🏷️" title="No account types" body="Create account types in Add / Edit to organise your accounts." />
          ) : filteredTypes.length === 0 ? (
            <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}".`} />
          ) : (
            filteredTypes.map(at => {
              const count = linkedCount(at.id, 'type');
              return (
                <div key={at.id} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '13px 14px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}>
                  <div>
                    <div style={{ color: C.text, fontSize: 15, fontWeight: 700, fontFamily: C.sans, marginBottom: 2 }}>
                      <Highlight text={at.name} query={query} />
                    </div>
                    <div style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans }}>
                      {count > 0 ? `${count} project${count !== 1 ? 's' : ''}` : 'No projects linked'}
                    </div>
                  </div>
                  <button onClick={() => setDeleteTarget({ id: at.id, kind: 'type', name: at.name })} style={{
                    background: 'transparent', border: `1px solid ${C.border}`,
                    borderRadius: 7, color: C.red, cursor: 'pointer',
                    padding: '6px 12px', fontFamily: C.sans, fontSize: 12, fontWeight: 600,
                    flexShrink: 0,
                  }}>Delete</button>
                </div>
              );
            })
          )
        ) : (
          emails.length === 0 ? (
            <EmptyState icon="✉️" title="No emails" body="Add email addresses in Add / Edit to link them to projects." />
          ) : filteredEmails.length === 0 ? (
            <EmptyState icon="🔍" title="No matches" body={`Nothing matches "${query}".`} />
          ) : (
            filteredEmails.map(em => {
              const count = linkedCount(em.id, 'email');
              return (
                <div key={em.id} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '13px 14px', marginBottom: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: C.gold, fontSize: 14, fontFamily: C.mono, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Highlight text={em.address} query={query} />
                    </div>
                    {em.label && (
                      <div style={{ color: C.textSub, fontSize: 12, fontFamily: C.sans }}>
                        <Highlight text={em.label} query={query} />
                      </div>
                    )}
                    <div style={{ color: C.textMut, fontSize: 11, fontFamily: C.sans, marginTop: 1 }}>
                      {count > 0 ? `${count} project${count !== 1 ? 's' : ''}` : 'No projects linked'}
                    </div>
                  </div>
                  <button onClick={() => setDeleteTarget({ id: em.id, kind: 'email', name: em.address })} style={{
                    background: 'transparent', border: `1px solid ${C.border}`,
                    borderRadius: 7, color: C.red, cursor: 'pointer',
                    padding: '6px 12px', fontFamily: C.sans, fontSize: 12, fontWeight: 600,
                    flexShrink: 0,
                  }}>Delete</button>
                </div>
              );
            })
          )
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title={`Delete ${deleteTarget.kind === 'type' ? 'Account Type' : 'Email'}`}
          message={
            hasLinks
              ? `"${deleteTarget.name}" is linked to ${linkCount} project${linkCount !== 1 ? 's' : ''}. Choose how to proceed.`
              : `Delete "${deleteTarget.name}"? This cannot be undone.`
          }
          confirmLabel={hasLinks ? 'Delete, keep links' : 'Delete'}
          danger
          onConfirm={() => confirmDelete(false)}
          onCancel={() => setDeleteTarget(null)}
          extraAction={hasLinks ? { label: 'Delete & remove all links', onClick: () => confirmDelete(true) } : undefined}
        />
      )}
    </div>
  );
}

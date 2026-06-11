import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { PageHeader } from './components/PageHeader';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ToastProvider } from './components/UI';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { Accounts } from './pages/Accounts';
import { AddEdit } from './pages/AddEdit';
import { Settings } from './pages/Settings';
import { C } from './utils/tokens';
import type { Page } from './types';

export default function App() {
  const { hydrate, hydrated } = useStore();
  const [page, setPage]               = useState<Page>('Dashboard');
  const [menuOpen, setMenuOpen]       = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | undefined>();

  useEffect(() => { hydrate(); }, []);

  if (!hydrated) {
    return (
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: C.bg,
        flexDirection: 'column', gap: 20,
      }}>
        <img src="/icon_192x192.png" alt="Projects Register" style={{ width: 72, height: 72, borderRadius: 18 }} />
        <div style={{ color: C.textMut, fontFamily: C.sans, fontSize: 13 }}>Loading…</div>
      </div>
    );
  }

  function navigate(p: Page) {
    setPage(p);
    setMenuOpen(false);
  }

  function goToAddEdit(projectId?: string) {
    setEditProjectId(projectId);
    setPage('Add / Edit');
  }

  function handleClearEdit() {
    const wasEditing = !!editProjectId;
    setEditProjectId(undefined);
    if (wasEditing) navigate('Projects');
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: C.bg, overflowY: 'auto', position: 'relative',
    }}>
      <PageHeader title={page} onMenuOpen={() => setMenuOpen(true)} />

      <div style={{ flex: 1 }}>
        {page === 'Dashboard'  && <Dashboard onNavigate={navigate} />}
        {page === 'Projects'   && <Projects onAddEdit={goToAddEdit} />}
        {page === 'Accounts'   && <Accounts />}
        {page === 'Add / Edit' && <AddEdit editProjectId={editProjectId} onClearEdit={handleClearEdit} />}
        {page === 'Settings'   && <Settings />}
      </div>

      {menuOpen && (
        <HamburgerMenu
          currentPage={page}
          onNavigate={navigate}
          onClose={() => setMenuOpen(false)}
        />
      )}

      <ToastProvider />
    </div>
  );
}

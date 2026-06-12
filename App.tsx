import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { HamburgerMenu } from './components/HamburgerMenu';
import { ToastProvider } from './components/UI';
import { Projects }  from './pages/Projects';
import { Platforms } from './pages/Platforms';
import { Accounts }  from './pages/Accounts';
import { AddEdit }   from './pages/AddEdit';
import { Settings }  from './pages/Settings';
import { C } from './utils/tokens';
import type { MenuPage } from './types';

export default function App() {
  const { hydrate, hydrated } = useStore();
  const [page, setPage]               = useState<MenuPage>('Projects');
  const [menuOpen, setMenuOpen]       = useState(false);
  const [editProjectId, setEditProjectId] = useState<string|undefined>();

  useEffect(() => { hydrate(); }, []);

  if (!hydrated) {
    return (
      <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:C.bg, flexDirection:'column', gap:20 }}>
        <img src="/icon_192x192.png" alt="" style={{ width:72, height:72, borderRadius:18 }}/>
        <div style={{ color:C.textMut, fontFamily:C.sans, fontSize:13 }}>Loading…</div>
      </div>
    );
  }

  function navigate(p: MenuPage) {
    setPage(p);
    setMenuOpen(false);
  }

  function goToAddEdit(projectId?: string) {
    setEditProjectId(projectId);
    setPage('Add / Edit' as MenuPage);
  }

  function handleClearEdit() {
    const wasEditing = !!editProjectId;
    setEditProjectId(undefined);
    if (wasEditing) navigate('Projects');
  }

  const openMenu = () => setMenuOpen(true);

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:C.bg, overflowY:'auto', position:'relative' }}>

      {page === 'Projects'   && <Projects  onAddEdit={goToAddEdit} onMenuOpen={openMenu}/>}
      {page === 'Platforms'  && <Platforms onMenuOpen={openMenu}/>}
      {page === 'Accounts'   && <Accounts  onMenuOpen={openMenu}/>}
      {page === 'Add / Edit' && <AddEdit   editProjectId={editProjectId} onClearEdit={handleClearEdit} onMenuOpen={openMenu}/>}
      {page === 'Settings'   && <Settings  onMenuOpen={openMenu}/>}

      {menuOpen && (
        <HamburgerMenu
          currentPage={page}
          onNavigate={navigate}
          onClose={()=>setMenuOpen(false)}
        />
      )}

      <ToastProvider/>
    </div>
  );
}

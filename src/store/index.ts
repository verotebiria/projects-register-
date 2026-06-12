import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import type { Project, Platform, Account, ProjectAccount, ProjectStatus } from '../types';

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function now() { return new Date().toISOString(); }

interface AppState {
  projects:  Project[];
  platforms: Platform[];
  accounts:  Account[];
  hydrated:  boolean;

  hydrate: () => Promise<void>;
  persist: () => Promise<void>;

  addProject:    (d: Omit<Project, 'id'|'createdAt'|'updatedAt'>) => void;
  updateProject: (id: string, d: Partial<Omit<Project, 'id'|'createdAt'>>) => void;
  deleteProject: (id: string) => void;

  addPlatform:    (name: string) => void;
  updatePlatform: (id: string, name: string) => void;
  deletePlatform: (id: string) => void;

  addAccount:    (value: string, label?: string) => void;
  updateAccount: (id: string, value: string, label?: string) => void;
  deleteAccount: (id: string) => void;

  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  clearAll: () => void;
}

const KEY = 'pr_v3';

export const useStore = create<AppState>((set, get) => ({
  projects: [], platforms: [], accounts: [], hydrated: false,

  hydrate: async () => {
    try {
      const { value } = await Preferences.get({ key: KEY });
      if (value) {
        const p = JSON.parse(value);
        set({ projects: p.projects??[], platforms: p.platforms??[], accounts: p.accounts??[] });
      }
    } catch {}
    set({ hydrated: true });
  },

  persist: async () => {
    const { projects, platforms, accounts } = get();
    await Preferences.set({ key: KEY, value: JSON.stringify({ projects, platforms, accounts }) });
  },

  addProject: (d) => {
    const p: Project = { ...d, id: uid(), createdAt: now(), updatedAt: now() };
    set(s => ({ projects: [p, ...s.projects] }));
    get().persist();
  },
  updateProject: (id, d) => {
    set(s => ({ projects: s.projects.map(p => p.id===id ? {...p,...d,updatedAt:now()} : p) }));
    get().persist();
  },
  deleteProject: (id) => {
    set(s => ({ projects: s.projects.filter(p => p.id!==id) }));
    get().persist();
  },

  addPlatform: (name) => {
    set(s => ({ platforms: [...s.platforms, { id:uid(), name, createdAt:now() }] }));
    get().persist();
  },
  updatePlatform: (id, name) => {
    set(s => ({ platforms: s.platforms.map(p => p.id===id ? {...p,name} : p) }));
    get().persist();
  },
  deletePlatform: (id) => {
    set(s => ({
      platforms: s.platforms.filter(p => p.id!==id),
      projects:  s.projects.map(p => ({...p, accounts: p.accounts.filter(a => a.platformId!==id)})),
    }));
    get().persist();
  },

  addAccount: (value, label) => {
    set(s => ({ accounts: [...s.accounts, { id:uid(), value, label, createdAt:now() }] }));
    get().persist();
  },
  updateAccount: (id, value, label) => {
    set(s => ({ accounts: s.accounts.map(a => a.id===id ? {...a,value,label} : a) }));
    get().persist();
  },
  deleteAccount: (id) => {
    set(s => ({
      accounts:  s.accounts.filter(a => a.id!==id),
      projects:  s.projects.map(p => ({...p, accounts: p.accounts.filter(a => a.accountId!==id)})),
    }));
    get().persist();
  },

  exportBackup: () => {
    const { projects, platforms, accounts } = get();
    return JSON.stringify({ projects, platforms, accounts, exportedAt: now() }, null, 2);
  },
  importBackup: (json) => {
    try {
      const p = JSON.parse(json);
      if (!Array.isArray(p.projects)||!Array.isArray(p.platforms)||!Array.isArray(p.accounts)) return false;
      set({ projects: p.projects, platforms: p.platforms, accounts: p.accounts });
      get().persist();
      return true;
    } catch { return false; }
  },
  clearAll: () => { set({ projects:[], platforms:[], accounts:[] }); get().persist(); },
}));

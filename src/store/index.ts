import { create } from 'zustand';
import { Preferences } from '@capacitor/preferences';
import type { Project, AccountType, EmailEntry } from '../types';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function now(): string {
  return new Date().toISOString();
}

interface AppState {
  projects: Project[];
  accountTypes: AccountType[];
  emails: EmailEntry[];
  hydrated: boolean;

  hydrate: () => Promise<void>;
  persist: () => Promise<void>;

  addProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, data: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
  deleteProject: (id: string) => void;

  addAccountType: (name: string) => void;
  updateAccountType: (id: string, name: string) => void;
  deleteAccountType: (id: string, removeLinks: boolean) => void;

  addEmail: (address: string, label?: string) => void;
  updateEmail: (id: string, address: string, label?: string) => void;
  deleteEmail: (id: string, removeLinks: boolean) => void;

  exportBackup: () => string;
  importBackup: (json: string) => boolean;
  clearAll: () => void;
}

const STORE_KEY = 'projects_register_v1';

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  accountTypes: [],
  emails: [],
  hydrated: false,

  hydrate: async () => {
    try {
      const { value } = await Preferences.get({ key: STORE_KEY });
      if (value) {
        const parsed = JSON.parse(value);
        set({
          projects: parsed.projects ?? [],
          accountTypes: parsed.accountTypes ?? [],
          emails: parsed.emails ?? [],
        });
      }
    } catch { /* first launch */ }
    set({ hydrated: true });
  },

  persist: async () => {
    const { projects, accountTypes, emails } = get();
    await Preferences.set({
      key: STORE_KEY,
      value: JSON.stringify({ projects, accountTypes, emails }),
    });
  },

  addProject: (data) => {
    const project: Project = { ...data, id: uid(), createdAt: now(), updatedAt: now() };
    set(s => ({ projects: [project, ...s.projects] }));
    get().persist();
  },

  updateProject: (id, data) => {
    set(s => ({
      projects: s.projects.map(p => p.id === id ? { ...p, ...data, updatedAt: now() } : p),
    }));
    get().persist();
  },

  deleteProject: (id) => {
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
    get().persist();
  },

  addAccountType: (name) => {
    set(s => ({ accountTypes: [...s.accountTypes, { id: uid(), name, createdAt: now() }] }));
    get().persist();
  },

  updateAccountType: (id, name) => {
    set(s => ({ accountTypes: s.accountTypes.map(a => a.id === id ? { ...a, name } : a) }));
    get().persist();
  },

  deleteAccountType: (id, removeLinks) => {
    set(s => ({
      accountTypes: s.accountTypes.filter(a => a.id !== id),
      projects: removeLinks
        ? s.projects.map(p => ({ ...p, linkedAccountTypeIds: p.linkedAccountTypeIds.filter(x => x !== id) }))
        : s.projects,
      emails: removeLinks
        ? s.emails.map(e => ({ ...e, linkedAccountTypeIds: e.linkedAccountTypeIds.filter(x => x !== id) }))
        : s.emails,
    }));
    get().persist();
  },

  addEmail: (address, label) => {
    set(s => ({ emails: [...s.emails, { id: uid(), address, label, linkedAccountTypeIds: [], createdAt: now() }] }));
    get().persist();
  },

  updateEmail: (id, address, label) => {
    set(s => ({ emails: s.emails.map(e => e.id === id ? { ...e, address, label } : e) }));
    get().persist();
  },

  deleteEmail: (id, removeLinks) => {
    set(s => ({
      emails: s.emails.filter(e => e.id !== id),
      projects: removeLinks
        ? s.projects.map(p => ({ ...p, linkedEmailIds: p.linkedEmailIds.filter(x => x !== id) }))
        : s.projects,
    }));
    get().persist();
  },

  exportBackup: () => {
    const { projects, accountTypes, emails } = get();
    return JSON.stringify({ projects, accountTypes, emails, exportedAt: now() }, null, 2);
  },

  importBackup: (json) => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed.projects) || !Array.isArray(parsed.accountTypes) || !Array.isArray(parsed.emails)) return false;
      set({ projects: parsed.projects, accountTypes: parsed.accountTypes, emails: parsed.emails });
      get().persist();
      return true;
    } catch { return false; }
  },

  clearAll: () => {
    set({ projects: [], accountTypes: [], emails: [] });
    get().persist();
  },
}));

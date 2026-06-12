export interface ProjectAccount {
  platformId: string;
  accountId:  string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  notes?: string;
  tags: string[];
  accounts: ProjectAccount[];
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'Active' | 'Development' | 'Testing' | 'Archived';

export interface Platform {
  id: string;
  name: string;
  createdAt: string;
}

export interface Account {
  id: string;
  value: string;
  label?: string;
  createdAt: string;
}

export type MenuPage = 'Projects' | 'Platforms' | 'Accounts' | 'Add / Edit' | 'Settings';

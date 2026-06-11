export type ProjectStatus = 'Active' | 'Development' | 'Testing' | 'Archived';

export interface ProjectResources {
  repositoryUrl?: string;
  websiteUrl?: string;
  domainName?: string;
  hostingProvider?: string;
  firebaseProjectId?: string;
  vercelProject?: string;
  mapboxProject?: string;
  sanityDataset?: string;
  customNotes?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  notes?: string;
  tags: string[];
  resources: ProjectResources;
  linkedAccountTypeIds: string[];
  linkedEmailIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AccountType {
  id: string;
  name: string;
  createdAt: string;
}

export interface EmailEntry {
  id: string;
  address: string;
  label?: string;
  linkedAccountTypeIds: string[];
  createdAt: string;
}

export type Page = 'Dashboard' | 'Projects' | 'Accounts' | 'Add / Edit' | 'Settings';

export interface AdminUser {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  created_by: string | null;
}

export interface AdminPermission {
  id: string;
  admin_user_id: string;
  module: AdminModule;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
  created_at: string;
}

export type AdminModule = 
  | 'users' 
  | 'stats' 
  | 'analytics' 
  | 'crm' 
  | 'appointments' 
  | 'properties' 
  | 'images' 
  | 'emails'
  | 'admin_management';

export interface AdminRole {
  name: string;
  label: string;
  description: string;
  defaultPermissions: Partial<Record<AdminModule, { read: boolean; write: boolean; delete: boolean }>>;
}

export const ADMIN_ROLES: AdminRole[] = [
  {
    name: 'super_admin',
    label: 'Super Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    defaultPermissions: {
      users: { read: true, write: true, delete: true },
      stats: { read: true, write: true, delete: true },
      analytics: { read: true, write: true, delete: true },
      crm: { read: true, write: true, delete: true },
      appointments: { read: true, write: true, delete: true },
      properties: { read: true, write: true, delete: true },
      images: { read: true, write: true, delete: true },
      emails: { read: true, write: true, delete: true },
      admin_management: { read: true, write: true, delete: true }
    }
  },
  {
    name: 'admin',
    label: 'Administrateur',
    description: 'Gestion complète sauf administration des utilisateurs',
    defaultPermissions: {
      users: { read: true, write: true, delete: false },
      stats: { read: true, write: true, delete: false },
      analytics: { read: true, write: false, delete: false },
      crm: { read: true, write: true, delete: false },
      appointments: { read: true, write: true, delete: true },
      properties: { read: true, write: true, delete: true },
      images: { read: true, write: true, delete: true },
      emails: { read: true, write: true, delete: false },
      admin_management: { read: false, write: false, delete: false }
    }
  },
  {
    name: 'editor',
    label: 'Éditeur',
    description: 'Gestion du contenu et des biens immobiliers',
    defaultPermissions: {
      users: { read: true, write: false, delete: false },
      stats: { read: true, write: false, delete: false },
      analytics: { read: true, write: false, delete: false },
      crm: { read: true, write: true, delete: false },
      appointments: { read: true, write: true, delete: false },
      properties: { read: true, write: true, delete: false },
      images: { read: true, write: true, delete: false },
      emails: { read: false, write: false, delete: false },
      admin_management: { read: false, write: false, delete: false }
    }
  },
  {
    name: 'viewer',
    label: 'Observateur',
    description: 'Accès en lecture seule aux statistiques',
    defaultPermissions: {
      users: { read: true, write: false, delete: false },
      stats: { read: true, write: false, delete: false },
      analytics: { read: true, write: false, delete: false },
      crm: { read: true, write: false, delete: false },
      appointments: { read: true, write: false, delete: false },
      properties: { read: true, write: false, delete: false },
      images: { read: false, write: false, delete: false },
      emails: { read: false, write: false, delete: false },
      admin_management: { read: false, write: false, delete: false }
    }
  }
];
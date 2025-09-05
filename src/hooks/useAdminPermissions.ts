import { useMemo } from 'react';
import type { AdminUser, AdminModule } from '../types/admin';

export const useAdminPermissions = (currentUser: AdminUser | null) => {
  const hasPermission = (module: AdminModule, action: 'read' | 'write' | 'delete'): boolean => {
    if (!currentUser) return false;
    
    // Super admin a tous les droits
    if (currentUser.role === 'super_admin') return true;
    
    // Pour les autres rôles, vérifier les permissions spécifiques
    // En production, vous récupéreriez les permissions depuis la base de données
    const rolePermissions = {
      admin: {
        users: { read: true, write: true, delete: false },
        stats: { read: true, write: true, delete: false },
        analytics: { read: true, write: false, delete: false },
        crm: { read: true, write: true, delete: false },
        appointments: { read: true, write: true, delete: true },
        properties: { read: true, write: true, delete: true },
        images: { read: true, write: true, delete: true },
        content: { read: true, write: true, delete: false },
        design: { read: true, write: true, delete: false },
        emails: { read: true, write: true, delete: false },
        admin_management: { read: false, write: false, delete: false }
      },
      editor: {
        users: { read: true, write: false, delete: false },
        stats: { read: true, write: false, delete: false },
        analytics: { read: true, write: false, delete: false },
        crm: { read: true, write: true, delete: false },
        appointments: { read: true, write: true, delete: false },
        properties: { read: true, write: true, delete: false },
        images: { read: true, write: true, delete: false },
        content: { read: true, write: true, delete: false },
        design: { read: true, write: false, delete: false },
        emails: { read: false, write: false, delete: false },
        admin_management: { read: false, write: false, delete: false }
      },
      viewer: {
        users: { read: true, write: false, delete: false },
        stats: { read: true, write: false, delete: false },
        analytics: { read: true, write: false, delete: false },
        crm: { read: true, write: false, delete: false },
        appointments: { read: true, write: false, delete: false },
        properties: { read: true, write: false, delete: false },
        images: { read: false, write: false, delete: false },
        content: { read: false, write: false, delete: false },
        design: { read: false, write: false, delete: false },
        emails: { read: false, write: false, delete: false },
        admin_management: { read: false, write: false, delete: false }
      }
    };

    const permissions = rolePermissions[currentUser.role];
    return permissions?.[module]?.[action] || false;
  };

  const canAccessModule = (module: AdminModule): boolean => {
    return hasPermission(module, 'read');
  };

  const getAccessibleTabs = useMemo(() => {
    if (!currentUser) return [];

    const allTabs = [
      { key: 'users', label: 'Utilisateurs', module: 'users' as AdminModule },
      { key: 'stats', label: 'Statistiques', module: 'stats' as AdminModule },
      { key: 'analytics', label: 'Analytics', module: 'analytics' as AdminModule },
      { key: 'crm', label: 'CRM', module: 'crm' as AdminModule },
      { key: 'appointments', label: 'RDV', module: 'appointments' as AdminModule },
      { key: 'properties', label: 'Biens', module: 'properties' as AdminModule },
      { key: 'images', label: 'Images', module: 'images' as AdminModule },
      { key: 'content', label: 'Contenu', module: 'content' as AdminModule },
      { key: 'design', label: 'Design', module: 'design' as AdminModule },
      { key: 'emails', label: 'Emails', module: 'emails' as AdminModule },
      { key: 'admin_management', label: 'Administration', module: 'admin_management' as AdminModule },
      { key: 'diagnostic', label: 'Diagnostic', module: 'analytics' as AdminModule }
    ];

    return allTabs.filter(tab => canAccessModule(tab.module));
  }, [currentUser]);

  return {
    hasPermission,
    canAccessModule,
    getAccessibleTabs
  };
};
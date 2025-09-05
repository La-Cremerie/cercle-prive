import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Eye, EyeOff, Save, X, UserCheck, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminService } from '../services/adminService';
import type { AdminUser, AdminPermission, AdminModule, AdminRole } from '../types/admin';
import { ADMIN_ROLES } from '../types/admin';
import toast from 'react-hot-toast';

interface AdminUserManagementProps {
  currentUser: AdminUser;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ currentUser }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [permissions, setPermissions] = useState<{ [key: string]: AdminPermission[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'viewer' as AdminUser['role']
  });
  const [selectedPermissions, setSelectedPermissions] = useState<
    Partial<Record<AdminModule, { read: boolean; write: boolean; delete: boolean }>>
  >({});

  const modules: { key: AdminModule; label: string; description: string }[] = [
    { key: 'users', label: 'Utilisateurs', description: 'Gestion des inscriptions clients' },
    { key: 'stats', label: 'Statistiques', description: 'Graphiques et métriques' },
    { key: 'analytics', label: 'Analytics', description: 'Analyses avancées' },
    { key: 'crm', label: 'CRM', description: 'Gestion de la relation client' },
    { key: 'appointments', label: 'Rendez-vous', description: 'Planification des RDV' },
    { key: 'properties', label: 'Biens', description: 'Gestion du catalogue immobilier' },
    { key: 'images', label: 'Images', description: 'Gestion des images du site' },
    { key: 'content', label: 'Contenu', description: 'Modification des textes' },
    { key: 'design', label: 'Design', description: 'Personnalisation visuelle' },
    { key: 'emails', label: 'Emails', description: 'Configuration des emails' },
    { key: 'admin_management', label: 'Administration', description: 'Gestion des administrateurs' }
  ];

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const adminData = await AdminService.getAllAdmins();
      setAdmins(adminData);

      // Charger les permissions pour chaque admin
      const permissionsData: { [key: string]: AdminPermission[] } = {};
      for (const admin of adminData) {
        const adminPermissions = await AdminService.getAdminPermissions(admin.id);
        permissionsData[admin.id] = adminPermissions;
      }
      setPermissions(permissionsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des administrateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      nom: '',
      prenom: '',
      role: 'viewer'
    });
    setSelectedPermissions({});
    setEditingAdmin(null);
  };

  const handleRoleChange = (role: AdminUser['role']) => {
    setFormData(prev => ({ ...prev, role }));
    
    // Appliquer les permissions par défaut du rôle
    const roleConfig = ADMIN_ROLES.find(r => r.name === role);
    if (roleConfig) {
      setSelectedPermissions(roleConfig.defaultPermissions);
    }
  };

  const handlePermissionChange = (
    module: AdminModule,
    action: 'read' | 'write' | 'delete',
    value: boolean
  ) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [module]: {
        read: prev[module]?.read || false,
        write: prev[module]?.write || false,
        delete: prev[module]?.delete || false,
        ...prev[module],
        [action]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.nom || !formData.prenom) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!editingAdmin && !formData.password) {
      toast.error('Le mot de passe est requis pour un nouvel administrateur');
      return;
    }

    try {
      if (editingAdmin) {
        // Mise à jour des permissions seulement
        await AdminService.updateAdminPermissions(editingAdmin.id, selectedPermissions);
        toast.success('Permissions mises à jour avec succès');
      } else {
        // Création d'un nouvel admin
        await AdminService.createAdmin({
          email: formData.email,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom,
          role: formData.role,
          permissions: selectedPermissions,
          createdBy: currentUser.id
        });
        toast.success('Administrateur créé avec succès');
      }

      setShowForm(false);
      resetForm();
      loadAdmins();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'opération';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      email: admin.email,
      password: '',
      nom: admin.nom,
      prenom: admin.prenom,
      role: admin.role
    });
    
    // Charger les permissions actuelles
    const adminPermissions = permissions[admin.id] || [];
    const permissionsMap: Partial<Record<AdminModule, { read: boolean; write: boolean; delete: boolean }>> = {};
    
    adminPermissions.forEach(perm => {
      permissionsMap[perm.module] = {
        read: perm.can_read,
        write: perm.can_write,
        delete: perm.can_delete
      };
    });
    
    setSelectedPermissions(permissionsMap);
    setShowForm(true);
  };

  const handleDeactivate = async (adminId: string) => {
    if (adminId === currentUser.id) {
      toast.error('Vous ne pouvez pas vous désactiver vous-même');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir désactiver cet administrateur ?')) {
      try {
        await AdminService.deactivateAdmin(adminId);
        toast.success('Administrateur désactivé');
        loadAdmins();
      } catch (error) {
        toast.error('Erreur lors de la désactivation');
      }
    }
  };

  const handleActivate = async (adminId: string) => {
    try {
      await AdminService.activateAdmin(adminId);
      toast.success('Administrateur réactivé');
      loadAdmins();
    } catch (error) {
      toast.error('Erreur lors de la réactivation');
    }
  };

  const handleDelete = async (adminId: string) => {
    if (adminId === currentUser.id) {
      toast.error('Vous ne pouvez pas vous supprimer vous-même');
      return;
    }


    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cet administrateur ?')) {
      try {
        await AdminService.deleteAdmin(adminId);
        toast.success('Administrateur supprimé');
        loadAdmins();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };


  const handleActivate = async (adminId: string) => {
    try {
      await AdminService.activateAdmin(adminId);
      toast.success('Administrateur réactivé');
      loadAdmins();
    } catch (error) {
      toast.error('Erreur lors de la réactivation');
    }
  };

  const getRoleColor = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'editor': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleLabel = (role: AdminUser['role']) => {
    const roleConfig = ADMIN_ROLES.find(r => r.name === role);
    return roleConfig?.label || role;
  };

  if (currentUser.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          Accès Restreint
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Seuls les super administrateurs peuvent gérer les utilisateurs admin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">
            Gestion des Administrateurs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {admins.length} administrateur(s) configuré(s)
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel administrateur</span>
        </button>
      </div>

      {/* Liste des administrateurs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Administrateurs
          </h3>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-yellow-600 rounded-full animate-spin"></div>
              <span>Chargement...</span>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Administrateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                            <Users className="w-5 h-5 text-yellow-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {admin.prenom} {admin.nom}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                        {getRoleLabel(admin.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {admin.is_active ? (
                          <>
                            <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-green-600">Actif</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm text-red-600">Inactif</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {admin.last_login 
                        ? new Date(admin.last_login).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(admin)}
                          className="text-yellow-600 hover:text-yellow-700 transition-colors"
                          title="Modifier les permissions"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {admin.id !== currentUser.id && (
                          <>
                            {admin.is_active ? (
                              <button
                                onClick={() => handleDeactivate(admin.id)}
                                className="text-orange-600 hover:text-orange-700 transition-colors"
                                title="Désactiver"
                              >
                                <EyeOff className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivate(admin.id)}
                                className="text-green-600 hover:text-green-700 transition-colors"
                                title="Réactiver"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(admin.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aperçu des rôles */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Rôles et Permissions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADMIN_ROLES.map((role) => (
            <div key={role.name} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getRoleColor(role.name as AdminUser['role'])}`}>
                {role.label}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {role.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Object.keys(role.defaultPermissions).length} module(s) autorisé(s)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de formulaire */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {editingAdmin ? 'Modifier les permissions' : 'Nouvel administrateur'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Informations de base */}
                {!editingAdmin && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        value={formData.nom}
                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        value={formData.prenom}
                        onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mot de passe *
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Sélection du rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Rôle
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {ADMIN_ROLES.map((role) => (
                      <label
                        key={role.name}
                        className={`cursor-pointer border-2 rounded-lg p-4 transition-colors ${
                          formData.role === role.name
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.name}
                          checked={formData.role === role.name}
                          onChange={() => handleRoleChange(role.name as AdminUser['role'])}
                          className="sr-only"
                        />
                        <div className={`text-sm font-medium mb-2 ${getRoleColor(role.name as AdminUser['role'])} inline-block px-2 py-1 rounded`}>
                          {role.label}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {role.description}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Permissions détaillées */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Permissions par module
                  </label>
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <div key={module.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {module.label}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {module.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedPermissions[module.key]?.read || false}
                              onChange={(e) => handlePermissionChange(module.key, 'read', e.target.checked)}
                              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Lecture</span>
                          </label>
                          
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedPermissions[module.key]?.write || false}
                              onChange={(e) => handlePermissionChange(module.key, 'write', e.target.checked)}
                              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Écriture</span>
                          </label>
                          
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedPermissions[module.key]?.delete || false}
                              onChange={(e) => handlePermissionChange(module.key, 'delete', e.target.checked)}
                              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Suppression</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingAdmin ? 'Mettre à jour' : 'Créer'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUserManagement;
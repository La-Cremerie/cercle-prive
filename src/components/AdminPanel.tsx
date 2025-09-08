import React, { useState, useEffect } from 'react';
import { Users, Download, RefreshCw, LogOut, Search, Filter, Mail, BarChart3, Settings, Calendar, MessageSquare, TrendingUp, Image, Palette, Shield, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { UserService } from '../services/userService';
import { EmailService } from '../services/emailService';
import { AdminService } from '../services/adminService';
import type { UserRegistration } from '../types/database';
import type { AdminUser } from '../types/admin';
import { useAdminPermissions } from '../hooks/useAdminPermissions';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRealTimeSync } from '../hooks/useRealTimeSync';
import { RealTimeSyncService } from '../services/realTimeSync';
import StatsCharts from './StatsCharts';
import EmailSettings from './EmailSettings';
import AdvancedAnalytics from './AdvancedAnalytics';
import CRMSystem from './CRMSystem';
import AppointmentBooking from './AppointmentBooking';
import PropertyManagement from './PropertyManagement';
import PresentationImageManager from './PresentationImageManager';
import ContentManager from './ContentManager';
import DesignCustomizer from './DesignCustomizer';
import AdminUserManagement from './AdminUserManagement';
import LeadScoring from './LeadScoring';
import SEOManager from './SEOManager';
import PerformanceOptimizer from './PerformanceOptimizer';
import ContentSyncDashboard from './ContentSyncDashboard';
import DiagnosticPanel from './DiagnosticPanel';
import AuthenticationTester from './AuthenticationTester';
import HTTPSSyncMonitor from './HTTPSSyncMonitor';
import ContentManagementDiagnostic from './ContentManagementDiagnostic';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<string>('users');
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRegistration | null>(null);
  const [userFormData, setUserFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  
  const { hasPermission, canAccessModule, getAccessibleTabs } = useAdminPermissions(currentUser);
  const { broadcastChange, connectionStatus } = useRealTimeSync('admin-panel');

  // Charger l'utilisateur admin actuel
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        // Simuler la récupération de l'utilisateur actuel
        // En production, vous utiliseriez l'ID de session
        const mockCurrentUser: AdminUser = {
          id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          email: 'nicolas.c@lacremerie.fr',
          nom: 'Crémerie',
          prenom: 'Nicolas',
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          created_by: null
        };
        setCurrentUser(mockCurrentUser);
      } catch (error) {
        toast.error('Erreur lors du chargement du profil admin');
      }
    };

    loadCurrentUser();
  }, []);

  // Définir le premier onglet accessible comme onglet par défaut
  useEffect(() => {
    if (currentUser) {
      const accessibleTabs = getAccessibleTabs;
      if (accessibleTabs.length > 0 && !accessibleTabs.find(tab => tab.key === activeTab)) {
        setActiveTab(accessibleTabs[0].key);
      }
    }
  }, [currentUser, activeTab, getAccessibleTabs]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await UserService.getAllUsers();
      setUsers(userData);
      setFilteredUsers(userData);
      toast.success(`${userData.length} utilisateurs chargés`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des utilisateurs';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telephone.includes(searchTerm)
      );
    }

    // Filtrage par date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(user => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        
        switch (dateFilter) {
          case 'today':
            return userDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return userDate >= weekAgo;
          case 'month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return userDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, dateFilter]);

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const headers = ['Nom', 'Prénom', 'Téléphone', 'Email', 'Date d\'inscription'];
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        `"${user.nom}"`,
        `"${user.prenom}"`,
        `"${user.telephone}"`,
        `"${user.email}"`,
        user.created_at ? `"${new Date(user.created_at).toLocaleDateString('fr-FR')}"` : '""'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filteredUsers.length} utilisateurs exportés`);
  };

  const resetUserForm = () => {
    setUserFormData({
      nom: '',
      prenom: '',
      telephone: '',
      email: ''
    });
    setEditingUser(null);
  };

  const handleEditUser = (user: UserRegistration) => {
    setEditingUser(user);
    setUserFormData({
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone,
      email: user.email
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`)) {
      try {
        await UserService.deleteUser(userId);
        // Diffuser le changement en temps réel
        await broadcastChange('users', 'delete', { id: userId, name: userName });
        await loadUsers();
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
        toast.error(errorMessage);
      }
    }
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userFormData.nom || !userFormData.prenom || !userFormData.email || !userFormData.telephone) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      if (editingUser) {
        await UserService.updateUser(editingUser.id, userFormData);
        // Diffuser le changement en temps réel
        await broadcastChange('users', 'update', { ...userFormData, id: editingUser.id });
        toast.success('Utilisateur modifié avec succès');
      } else {
        await UserService.createUser(userFormData);
        // Diffuser le changement en temps réel
        await broadcastChange('users', 'create', userFormData);
        toast.success('Nouvel utilisateur créé avec succès');
      }
      
      setShowUserForm(false);
      resetUserForm();
      await loadUsers();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'opération';
      toast.error(errorMessage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    toast.success('Déconnexion réussie');
    onLogout();
  };


  const getStatsForPeriod = (period: 'today' | 'week' | 'month') => {
    const now = new Date();
    return users.filter(user => {
      if (!user.created_at) return false;
      const userDate = new Date(user.created_at);
      
      switch (period) {
        case 'today':
          return userDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return userDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return userDate >= monthAgo;
        default:
          return false;
      }
    }).length;
  };

  const sendEmailToUser = async (user: UserRegistration) => {
    try {
      await EmailService.sendWelcomeEmail(user);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-yellow-600" />
              <div>
                <h1 className="text-xl font-light text-gray-900">
                  Panel d'Administration
                </h1>
                <p className="text-sm text-gray-600 font-light">
                  Gestion des inscriptions et des statistiques
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Indicateur de connexion temps réel */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                {/* Bouton Toggle Online/Offline */}
                <button
                  onClick={() => {
                    // Déclencher une synchronisation manuelle
                    const performManualSync = async () => {
                      try {
                        toast.loading('Synchronisation manuelle en cours...', { id: 'manual-sync' });
                        
                       // 1. D'abord sauvegarder toutes les modifications locales
                       console.log('💾 Sauvegarde des modifications locales...');
                       
                       // Sauvegarder le contenu du site
                       const siteContent = localStorage.getItem('siteContent');
                       if (siteContent) {
                         window.dispatchEvent(new CustomEvent('contentUpdated', { detail: JSON.parse(siteContent) }));
                       }
                       
                       // Sauvegarder les propriétés
                       const properties = localStorage.getItem('properties');
                       if (properties) {
                         window.dispatchEvent(new Event('storage'));
                       }
                       
                       // Sauvegarder les images de présentation
                       const presentationImages = localStorage.getItem('presentationImages');
                       if (presentationImages) {
                         const images = JSON.parse(presentationImages);
                         const activeImage = images.find((img: any) => img.isActive);
                         if (activeImage) {
                           window.dispatchEvent(new CustomEvent('presentationImageChanged', { detail: activeImage.url }));
                         }
                       }
                       
                       // Sauvegarder les paramètres de design
                       const designSettings = localStorage.getItem('designSettings');
                       if (designSettings) {
                         window.dispatchEvent(new CustomEvent('designSettingsChanged', { detail: JSON.parse(designSettings) }));
                       }
                       
                       // 2. Diffuser tous les changements via le service de sync
                       console.log('📡 Diffusion des changements...');
                       
                       if (siteContent) {
                         await broadcastChange('content', 'update', JSON.parse(siteContent));
                       }
                       
                       if (properties) {
                         await broadcastChange('properties', 'update', JSON.parse(properties));
                       }
                       
                       if (presentationImages) {
                         const images = JSON.parse(presentationImages);
                         const activeImage = images.find((img: any) => img.isActive);
                         await broadcastChange('images', 'update', {
                           category: 'hero',
                           images,
                           activeImage: activeImage?.url
                         });
                       }
                       
                       if (designSettings) {
                         await broadcastChange('design', 'update', JSON.parse(designSettings));
                       }
                       
                       // 3. Forcer la reconnexion et synchronisation
                        // Forcer la reconnexion et synchronisation
                        await RealTimeSyncService.getInstance().reconnect();
                        
                       // 4. Recharger les données utilisateurs
                        await loadUsers();
                        
                       toast.success('Modifications sauvegardées et synchronisées !', { id: 'manual-sync', icon: '✅' });
                      } catch (error) {
                       console.error('Erreur sync manuelle:', error);
                       toast.error('Erreur lors de la sauvegarde/synchronisation', { id: 'manual-sync' });
                      }
                    };
                    
                    performManualSync();
                  }}
                 className="flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 bg-green-100 text-green-700 hover:bg-green-200 shadow-sm"
                 title="Sauvegarder toutes les modifications et les publier en ligne"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    connectionStatus.connected ? 'bg-green-500' : 'bg-orange-500'
                  }`}></div>
                 <span>PUBLIER POUR TOUS</span>
                </button>
                
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500 animate-pulse'
                }`}></div>
                <div className="text-sm">
                  <div className={`font-medium ${
                    connectionStatus.connected ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    {connectionStatus.connected ? '🟢 MISES À JOUR AUTOMATIQUES' : '🟠 MODE MANUEL'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {connectionStatus.connected 
                      ? `${connectionStatus.subscribers} composant(s) synchronisé(s)`
                      : 'Synchronisation désactivée'
                    }
                  </div>
                </div>
              </div>
            <div className="flex space-x-2">
              <button
                onClick={loadUsers}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
              <button
                onClick={() => {
                  // Fermer le panel admin et retourner au site
                  onLogout();
                  // Ne pas supprimer la session admin, juste fermer le panel
                  setTimeout(() => {
                    localStorage.setItem('adminLoggedIn', 'true');
                  }, 100);
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
              >
                <Users className="w-4 h-4" />
                <span>Retour au site</span>
              </button>
              <button
                onClick={() => setShowEmailSettings(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Emails</span>
              </button>
              <button
                onClick={exportToCSV}
                disabled={filteredUsers.length === 0}
                className="flex items-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Exporter CSV</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {getAccessibleTabs.map((tab) => {
                const getTabIcon = (tabKey: string) => {
                  switch (tabKey) {
                    case 'users': return <Users className="w-4 h-4" />;
                    case 'stats': return <BarChart3 className="w-4 h-4" />;
                    case 'analytics': return <TrendingUp className="w-4 h-4" />;
                    case 'crm': return <MessageSquare className="w-4 h-4" />;
                    case 'appointments': return <Calendar className="w-4 h-4" />;
                    case 'properties': return <Settings className="w-4 h-4" />;
                    case 'content': return <Settings className="w-4 h-4" />;
                    case 'design': return <Palette className="w-4 h-4" />;
                    case 'emails': return <Mail className="w-4 h-4" />;
                    case 'admin_management': return <Shield className="w-4 h-4" />;
                    case 'lead_scoring': return <TrendingUp className="w-4 h-4" />;
                    case 'seo': return <Search className="w-4 h-4" />;
                    case 'performance': return <Settings className="w-4 h-4" />;
                    case 'sync_dashboard': return <RefreshCw className="w-4 h-4" />;
                    case 'diagnostic': return <Settings className="w-4 h-4" />;
                    case 'https_monitor': return <Shield className="w-4 h-4" />;
                    default: return <Settings className="w-4 h-4" />;
                  }
                };

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-yellow-500 text-yellow-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {getTabIcon(tab.key)}
                      <span>
                        {tab.label}
                        {tab.key === 'users' ? ` (${users.length})` : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-light text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
                <p className="text-2xl font-light text-gray-900">{getStatsForPeriod('today')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cette semaine</p>
                <p className="text-2xl font-light text-gray-900">{getStatsForPeriod('week')}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ce mois</p>
                <p className="text-2xl font-light text-gray-900">{getStatsForPeriod('month')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && canAccessModule('users') && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="today">Aujourd'hui</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                  </select>
                  {hasPermission('users', 'write') && (
                    <button
                      onClick={() => {
                        resetUserForm();
                        setShowUserForm(true);
                      }}
                      className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter</span>
                    </button>
                  )}
                </div>
              </div>
              {searchTerm || dateFilter !== 'all' ? (
                <div className="mt-4 text-sm text-gray-600">
                  {filteredUsers.length} résultat(s) trouvé(s) sur {users.length} total
                </div>
              ) : null}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Utilisateurs inscrits ({filteredUsers.length})
                </h2>
              </div>

              {isLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="inline-flex items-center space-x-2 text-gray-500">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Chargement des données...</span>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  {searchTerm || dateFilter !== 'all' 
                    ? 'Aucun utilisateur ne correspond aux critères de recherche'
                    : 'Aucune inscription pour le moment'
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prénom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Téléphone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.nom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.prenom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <a 
                              href={`mailto:${user.email}`}
                              className="text-yellow-600 hover:text-yellow-700 transition-colors"
                            >
                              {user.email}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <a 
                              href={`tel:${user.telephone}`}
                              className="text-yellow-600 hover:text-yellow-700 transition-colors"
                            >
                              {user.telephone}
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.created_at 
                              ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Non disponible'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              {hasPermission('users', 'write') && (
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="text-blue-600 hover:text-blue-700 transition-colors"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission('emails', 'write') && (
                                <button
                                  onClick={() => sendEmailToUser(user)}
                                  className="text-yellow-600 hover:text-yellow-700 transition-colors"
                                  title="Envoyer un email"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                              )}
                              {hasPermission('users', 'delete') && (
                                <button
                                  onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                                  className="text-red-600 hover:text-red-700 transition-colors"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
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
          </>
        )}

        {activeTab === 'stats' && canAccessModule('stats') && (
          <StatsCharts users={users} />
        )}

        {activeTab === 'analytics' && canAccessModule('analytics') && (
          <AdvancedAnalytics users={users} />
        )}

        {activeTab === 'crm' && canAccessModule('crm') && (
          <CRMSystem users={users} />
        )}

        {activeTab === 'appointments' && canAccessModule('appointments') && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AppointmentBooking />
          </div>
        )}

        {activeTab === 'properties' && canAccessModule('properties') && (
          <PropertyManagement />
        )}


        {activeTab === 'content' && canAccessModule('content') && (
          <ContentManager />
        )}

        {activeTab === 'design' && canAccessModule('design') && (
          <DesignCustomizer />
        )}

        {activeTab === 'admin_management' && canAccessModule('admin_management') && currentUser && (
          <AdminUserManagement currentUser={currentUser} />
        )}

        {activeTab === 'emails' && canAccessModule('emails') && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Gestion des Emails
              </h3>
              <p className="text-gray-600 mb-6">
                Configurez les emails automatiques et les templates
              </p>
              <button
                onClick={() => setShowEmailSettings(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors mx-auto"
              >
                <Settings className="w-5 h-5" />
                <span>Configurer les emails</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'admin_management' && canAccessModule('admin_management') && currentUser && (
          <AdminUserManagement currentUser={currentUser} />
        )}

        {activeTab === 'lead_scoring' && canAccessModule('analytics') && (
          <LeadScoring users={users} />
        )}

        {activeTab === 'seo' && canAccessModule('content') && (
          <SEOManager />
        )}

        {activeTab === 'performance' && canAccessModule('analytics') && (
          <PerformanceOptimizer />
        )}

        {activeTab === 'sync_dashboard' && canAccessModule('content') && (
          <ContentSyncDashboard />
        )}

        {activeTab === 'diagnostic' && canAccessModule('admin_management') && (
          <DiagnosticPanel />
        )}

       {activeTab === 'content_publisher' && canAccessModule('content') && (
         <ContentPublisher />
       )}

        {activeTab === 'content_diagnostic' && canAccessModule('admin_management') && (
          <ContentManagementDiagnostic />
        )}

        {activeTab === 'https_monitor' && canAccessModule('admin_management') && (
          <HTTPSSyncMonitor />
        )}

        {activeTab === 'auth_test' && canAccessModule('admin_management') && (
          <AuthenticationTester />
        )}

        {activeTab === 'nicolas_content' && canAccessModule('content') && (
          <NicolasContentViewer />
        )}

        {/* Message d'accès refusé */}
        {!canAccessModule(activeTab as any) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Accès Restreint
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Vous n'avez pas les permissions nécessaires pour accéder à cette section.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Email Settings Modal */}
      {showEmailSettings && (
        <EmailSettings onClose={() => setShowEmailSettings(false)} />
      )}

      {/* User Form Modal */}
      <AnimatePresence>
        {showUserForm && (
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
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowUserForm(false);
                      resetUserForm();
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUserFormSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={userFormData.nom}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, nom: e.target.value }))}
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
                    value={userFormData.prenom}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, prenom: e.target.value }))}
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
                    value={userFormData.email}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={userFormData.telephone}
                    onChange={(e) => setUserFormData(prev => ({ ...prev, telephone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      resetUserForm();
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
                    <span>{editingUser ? 'Modifier' : 'Créer'}</span>
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

export default AdminPanel;
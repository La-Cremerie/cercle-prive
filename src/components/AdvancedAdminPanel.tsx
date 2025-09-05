import React, { useState, useEffect } from 'react';
import { 
  Users, BarChart3, Settings, Mail, Image, Type, Palette, 
  LogOut, Bell, Download, RefreshCw, Search, Filter,
  Calendar, MessageSquare, TrendingUp, Eye, Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { UserService } from '../services/userService';
import { EmailService } from '../services/emailService';
import type { UserRegistration } from '../types/database';
import toast from 'react-hot-toast';

// Import des composants de gestion
import StatsCharts from './StatsCharts';
import EmailSettings from './EmailSettings';
import ContentManager from './ContentManager';
import DesignCustomizer from './DesignCustomizer';
import PresentationImageManager from './PresentationImageManager';
import SEOManager from './SEOManager';
import CRMSystem from './CRMSystem';
import LeadScoring from './LeadScoring';
import AdvancedAnalytics from './AdvancedAnalytics';

interface AdvancedAdminPanelProps {
  onLogout: () => void;
}

const AdvancedAdminPanel: React.FC<AdvancedAdminPanelProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<UserRegistration[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('users');
  const [showEmailSettings, setShowEmailSettings] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const userData = await UserService.getAllUsers();
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telephone.includes(searchTerm)
      );
    }

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
        `"${user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : ''}"`
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

  const tabs = [
    { key: 'users', label: 'Utilisateurs', icon: Users },
    { key: 'stats', label: 'Statistiques', icon: BarChart3 },
    { key: 'analytics', label: 'Analytics', icon: TrendingUp },
    { key: 'crm', label: 'CRM', icon: MessageSquare },
    { key: 'scoring', label: 'Lead Scoring', icon: TrendingUp },
    { key: 'content', label: 'Contenu', icon: Type },
    { key: 'design', label: 'Design', icon: Palette },
    { key: 'images', label: 'Images', icon: Image },
    { key: 'seo', label: 'SEO', icon: Globe },
    { key: 'emails', label: 'Emails', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-yellow-600" />
              <div>
                <h1 className="text-xl font-light text-gray-900 dark:text-white">
                  Administration CERCLE PRIVÉ
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Gestion complète de votre site immobilier
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadUsers}
                disabled={isLoading}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-4">
              <nav className="space-y-2">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                      activeTab === key
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Onglet Utilisateurs */}
              {activeTab === 'users' && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aujourd'hui</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{getStatsForPeriod('today')}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cette semaine</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{getStatsForPeriod('week')}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ce mois</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{getStatsForPeriod('month')}</p>
                        </div>
                        <Bell className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Rechercher par nom, prénom, email ou téléphone..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="all">Toutes les dates</option>
                          <option value="today">Aujourd'hui</option>
                          <option value="week">Cette semaine</option>
                          <option value="month">Ce mois</option>
                        </select>
                        <button
                          onClick={exportToCSV}
                          disabled={filteredUsers.length === 0}
                          className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Utilisateurs inscrits ({filteredUsers.length})
                      </h3>
                    </div>

                    {isLoading ? (
                      <div className="px-6 py-12 text-center">
                        <RefreshCw className="w-8 h-8 text-yellow-600 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-600 dark:text-gray-400">Chargement des données...</p>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                        {searchTerm || dateFilter !== 'all' 
                          ? 'Aucun utilisateur ne correspond aux critères'
                          : 'Aucune inscription pour le moment'
                        }
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Utilisateur
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Contact
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date d'inscription
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                      <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-yellow-600" />
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.prenom} {user.nom}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.telephone}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                  {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Date inconnue'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <a
                                      href={`mailto:${user.email}`}
                                      className="text-blue-600 hover:text-blue-700 transition-colors"
                                      title="Envoyer un email"
                                    >
                                      <Mail className="w-4 h-4" />
                                    </a>
                                    <a
                                      href={`tel:${user.telephone}`}
                                      className="text-green-600 hover:text-green-700 transition-colors"
                                      title="Appeler"
                                    >
                                      <Bell className="w-4 h-4" />
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Autres onglets */}
              {activeTab === 'stats' && <StatsCharts users={users} />}
              {activeTab === 'analytics' && <AdvancedAnalytics users={users} />}
              {activeTab === 'crm' && <CRMSystem users={users} />}
              {activeTab === 'scoring' && <LeadScoring users={users} />}
              {activeTab === 'content' && <ContentManager />}
              {activeTab === 'design' && <DesignCustomizer />}
              {activeTab === 'images' && <PresentationImageManager />}
              {activeTab === 'seo' && <SEOManager />}
              {activeTab === 'emails' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-light text-gray-900 dark:text-white">
                        Gestion des Emails
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Configuration des emails automatiques
                      </p>
                    </div>
                    <button
                      onClick={() => setShowEmailSettings(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Configurer</span>
                    </button>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Emails automatiques configurés
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">Email de bienvenue</h4>
                          <p className="text-sm text-green-600 dark:text-green-400">Envoyé automatiquement à chaque inscription</p>
                        </div>
                        <div className="text-green-600">✓ Actif</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">Notification admin</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Notification à nicolas.c@lacremerie.fr</p>
                        </div>
                        <div className="text-blue-600">✓ Actif</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Email Settings Modal */}
      {showEmailSettings && (
        <EmailSettings onClose={() => setShowEmailSettings(false)} />
      )}
    </div>
  );
};

export default AdvancedAdminPanel;
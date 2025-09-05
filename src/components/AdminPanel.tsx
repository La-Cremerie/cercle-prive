import React, { useState, useEffect } from 'react';
import { Users, Download, RefreshCw, LogOut, Search, Filter, Mail, BarChart3, Settings } from 'lucide-react';

interface User {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  created_at: string;
}

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Charger les utilisateurs depuis localStorage
  const loadUsers = () => {
    try {
      setIsLoading(true);
      const storedUsers = localStorage.getItem('registeredUsers');
      const userData = storedUsers ? JSON.parse(storedUsers) : [];
      setUsers(userData);
      setFilteredUsers(userData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
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
      alert('Aucune donnée à exporter');
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
        `"${new Date(user.created_at).toLocaleDateString('fr-FR')}"`
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
    
    alert(`${filteredUsers.length} utilisateurs exportés`);
  };

  const getStatsForPeriod = (period: 'today' | 'week' | 'month') => {
    const now = new Date();
    return users.filter(user => {
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

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    onLogout();
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
                  Panel d'Administration CERCLE PRIVÉ
                </h1>
                <p className="text-sm text-gray-600 font-light">
                  Gestion des inscriptions et statistiques
                </p>
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
                        {new Date(user.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center justify-center space-x-2">
                          <a
                            href={`mailto:${user.email}`}
                            className="text-yellow-600 hover:text-yellow-700 transition-colors"
                            title="Envoyer un email"
                          >
                            <Mail className="w-4 h-4" />
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
    </div>
  );
};

export default AdminPanel;
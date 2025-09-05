import React, { useState, useEffect } from 'react';
import { Calculator, GitCompare as Compare, Bell, LogOut, Settings, Users, BarChart3, Mail } from 'lucide-react';
import Chatbot from './components/Chatbot';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ThemeToggle from './components/ThemeToggle';
import AdminLogin from './components/AdminLogin';
import RentabilityCalculator from './components/RentabilityCalculator';
import PropertyComparator from './components/PropertyComparator';
import PropertyAlerts from './components/PropertyAlerts';
import { Toaster } from 'react-hot-toast';

// Panel d'administration simplifié
const SimpleAdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger les utilisateurs depuis localStorage
    const loadUsers = () => {
      try {
        const stored = localStorage.getItem('registeredUsers') || '[]';
        const userData = JSON.parse(stored);
        setUsers(userData);
      } catch (error) {
        console.error('Erreur chargement:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  const exportCSV = () => {
    if (users.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Date'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        `"${user.nom || ''}"`,
        `"${user.prenom || ''}"`,
        `"${user.email || ''}"`,
        `"${user.telephone || ''}"`,
        `"${user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`${users.length} utilisateurs exportés`);
  };

  const tabs = [
    { key: 'users', label: 'Utilisateurs', icon: Users },
    { key: 'stats', label: 'Statistiques', icon: BarChart3 },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
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
            {/* Onglet Utilisateurs */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Inscriptions</p>
                        <p className="text-2xl font-light text-gray-900 dark:text-white">{users.length}</p>
                      </div>
                      <Users className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cette Semaine</p>
                        <p className="text-2xl font-light text-gray-900 dark:text-white">
                          {users.filter(u => {
                            if (!u.created_at) return false;
                            const weekAgo = new Date();
                            weekAgo.setDate(weekAgo.getDate() - 7);
                            return new Date(u.created_at) >= weekAgo;
                          }).length}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Actions</p>
                        <button
                          onClick={exportCSV}
                          className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
                        >
                          Exporter CSV
                        </button>
                      </div>
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Table des utilisateurs */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Utilisateurs Inscrits ({users.length})
                    </h3>
                  </div>

                  {isLoading ? (
                    <div className="px-6 py-12 text-center">
                      <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      Aucune inscription pour le moment
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Utilisateur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Date
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {users.map((user, index) => (
                            <tr key={user.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-yellow-600" />
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
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
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

            {/* Onglet Statistiques */}
            {activeTab === 'stats' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Statistiques d'Inscription
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-3xl font-light text-blue-600 mb-2">{users.length}</div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">Total Inscriptions</div>
                    </div>
                    
                    <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-3xl font-light text-green-600 mb-2">
                        {users.filter(u => {
                          if (!u.created_at) return false;
                          const today = new Date();
                          return new Date(u.created_at).toDateString() === today.toDateString();
                        }).length}
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-200">Aujourd'hui</div>
                    </div>
                    
                    <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-3xl font-light text-yellow-600 mb-2">
                        {users.filter(u => {
                          if (!u.created_at) return false;
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(u.created_at) >= weekAgo;
                        }).length}
                      </div>
                      <div className="text-sm text-yellow-800 dark:text-yellow-200">Cette Semaine</div>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-3xl font-light text-purple-600 mb-2">
                        {users.filter(u => {
                          if (!u.created_at) return false;
                          const monthAgo = new Date();
                          monthAgo.setMonth(monthAgo.getMonth() - 1);
                          return new Date(u.created_at) >= monthAgo;
                        }).length}
                      </div>
                      <div className="text-sm text-purple-800 dark:text-purple-200">Ce Mois</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Emails */}
            {activeTab === 'emails' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                    Configuration des Emails
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                        ✅ Email de bienvenue
                      </h4>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Envoyé automatiquement à chaque nouvelle inscription
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                        ✅ Notification admin
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Notification envoyée à nicolas.c@lacremerie.fr pour chaque inscription
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                        📧 Template personnalisé
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        Messages personnalisés avec variables dynamiques (nom, prénom, etc.)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de connexion simplifié
const LoginForm: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    // Simulation d'inscription
    setTimeout(() => {
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(formData));
      onLoginSuccess();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 tracking-wider mb-2">
            CERCLE PRIVÉ
          </h1>
          <p className="text-sm text-gray-600 font-light">
            Accès exclusif à l'immobilier de prestige
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Votre nom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Votre prénom"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone *
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Votre téléphone"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Inscription...' : 'Accéder au Cercle Privé'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6 font-light">
          Accès exclusif aux biens immobiliers de prestige
        </p>
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    setIsLoggedIn(userLoggedIn === 'true');
    setIsAdminLoggedIn(adminLoggedIn === 'true');
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-light">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si admin connecté, afficher le panel admin
  if (isAdminLoggedIn) {
    return <SimpleAdminPanel onLogout={handleAdminLogout} />;
  }

  // Si demande de connexion admin, afficher le formulaire admin
  if (showAdminLogin) {
    return (
      <AdminLogin 
        onLoginSuccess={handleAdminLoginSuccess}
        onBack={() => setShowAdminLogin(false)}
      />
    );
  }

  // Si pas connecté, afficher le formulaire de connexion
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Si connecté, afficher le site complet
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navigation */}
        <nav className="bg-black/20 dark:bg-black/40 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-light tracking-wider text-white">CERCLE PRIVÉ</h1>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#concept" className="text-sm font-light text-white hover:text-yellow-500 transition-colors">CONCEPT</a>
                <a href="#services" className="text-sm font-light text-white hover:text-yellow-500 transition-colors">SERVICES</a>
                <a href="#biens" className="text-sm font-light text-white hover:text-yellow-500 transition-colors">BIENS</a>
                <a href="#contact" className="text-sm font-light text-white hover:text-yellow-500 transition-colors">CONTACT</a>
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm font-light text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>DÉCONNEXION</span>
                </button>
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center space-x-2 text-sm font-light text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>ADMIN</span>
                </button>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-white hover:text-yellow-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile menu */}
            {showMobileMenu && (
              <div className="md:hidden bg-black/40 backdrop-blur-sm">
                <div className="px-4 py-4 space-y-4">
                  <a href="#concept" className="block text-sm font-light text-white hover:text-yellow-500 transition-colors">CONCEPT</a>
                  <a href="#services" className="block text-sm font-light text-white hover:text-yellow-500 transition-colors">SERVICES</a>
                  <a href="#biens" className="block text-sm font-light text-white hover:text-yellow-500 transition-colors">BIENS</a>
                  <a href="#contact" className="block text-sm font-light text-white hover:text-yellow-500 transition-colors">CONTACT</a>
                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <ThemeToggle />
                    <button
                      onClick={handleLogout}
                      className="text-sm font-light text-red-400 hover:text-red-300 transition-colors"
                    >
                      DÉCONNEXION
                    </button>
                    <button
                      onClick={() => setShowAdminLogin(true)}
                      className="text-sm font-light text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      ADMIN
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center bg-gray-900 dark:bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)'
            }}
          >
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-light text-white mb-8 leading-tight">
              l'excellence immobilière<br />en toute discrétion
            </h1>
            <a 
              href="mailto:nicolas.c@lacremerie.fr"
              className="inline-block border border-white text-white px-8 py-3 text-sm font-light tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Entrer en relation
            </a>
          </div>
        </section>

        {/* Concept Section */}
        <section id="concept" className="py-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-light text-yellow-600 dark:text-yellow-500 mb-8">CONCEPT</h2>
                <div className="space-y-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Donnez de la puissance à votre capital, construisez un patrimoine solide.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Notre approche d'investissement vous permet de transformer un capital financier existant 
                    en une rentabilité complémentaire, tout en créant un véritable effet de levier patrimonial.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300">Acquisition immobilière rigoureusement sélectionnée</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300">Travaux et ameublement pensés pour la valorisation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300">Financement et structuration patrimoniale sur mesure</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Architecture moderne"
                  className="w-full h-96 object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">ACCOMPAGNEMENT PERSONNALISÉ</h2>
              <div className="w-24 h-px bg-yellow-600 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {[
                {
                  title: "Pack Immobilier Clé en Main",
                  description: "Solution complète de A à Z : recherche, acquisition, rénovation et ameublement de votre bien d'exception"
                },
                {
                  title: "Conciergerie",
                  description: "Services de conciergerie haut de gamme pour l'entretien et la gestion quotidienne de votre propriété"
                },
                {
                  title: "Architecture & Design",
                  description: "Conception architecturale sur-mesure et design d'intérieur raffiné pour créer des espaces uniques"
                },
                {
                  title: "Services Personnalisés",
                  description: "Prestations sur-mesure adaptées à vos besoins spécifiques et à votre style de vie d'exception"
                }
              ].map((service, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-8 border border-gray-200 dark:border-gray-700 hover:border-yellow-600/30 transition-all">
                  <h3 className="text-xl font-light text-gray-900 dark:text-white mb-4">{service.title}</h3>
                  <div className="w-12 h-px bg-yellow-600/30 mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Biens Section */}
        <section id="biens" className="py-20 bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-yellow-600 dark:text-yellow-500 mb-8">BIENS D'EXCEPTION</h2>
              <div className="w-24 h-px bg-yellow-600 mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Villa Horizon",
                  location: "Cannes, Côte d'Azur",
                  price: "4 500 000 €",
                  yield: "180 000 € / an",
                  image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
                },
                {
                  name: "Villa Azure",
                  location: "Saint-Tropez",
                  price: "6 200 000 €",
                  yield: "248 000 € / an",
                  image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800"
                },
                {
                  name: "Penthouse Élégance",
                  location: "Monaco, Monte-Carlo",
                  price: "12 800 000 €",
                  yield: "512 000 € / an",
                  image: "https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800"
                }
              ].map((property, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                  <img 
                    src={property.image}
                    alt={property.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-light text-gray-900 dark:text-white mb-2">{property.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{property.location}</p>
                    <div className="text-xl font-medium text-yellow-600 dark:text-yellow-500">{property.price}</div>
                    <div className="text-sm text-green-600 font-medium mb-4">
                      Rendement : {property.yield}
                    </div>
                    <a
                      href="mailto:nicolas.c@lacremerie.fr"
                      className="block w-full text-center bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                    >
                      Plus d'informations
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Outils immobiliers */}
            <div className="mt-16 text-center">
              <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-8">Outils d'Investissement</h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowCalculator(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Calculer la rentabilité</span>
                </button>
                <button
                  onClick={() => setShowComparator(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Compare className="w-5 h-5" />
                  <span>Comparer les biens</span>
                </button>
                <button
                  onClick={() => setShowAlerts(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span>Créer une alerte</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-900 dark:bg-black transition-colors">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-white dark:text-gray-100 mb-8">CONTACT</h2>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-xl font-medium text-white dark:text-gray-100 mb-4">Téléphone</h3>
                <a href="tel:+33652913556" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  +33 6 52 91 35 56
                </a>
              </div>
              
              <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-xl font-medium text-white dark:text-gray-100 mb-4">Email</h3>
                <a href="mailto:nicolas.c@lacremerie.fr" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                  nicolas.c@lacremerie.fr
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Composants UX avancés */}
      <Chatbot />
      <PWAInstallPrompt />
      
      {/* Modals pour les outils immobiliers */}
      {showCalculator && (
        <RentabilityCalculator onClose={() => setShowCalculator(false)} />
      )}
      
      {showComparator && (
        <PropertyComparator onClose={() => setShowComparator(false)} />
      )}
      
      {showAlerts && (
        <PropertyAlerts onClose={() => setShowAlerts(false)} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
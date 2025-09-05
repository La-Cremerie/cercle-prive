import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import './i18n';

// Components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import NotreAdnSection from './components/NotreAdnSection';
import ServicesSection from './components/ServicesSection';
import OffMarketSection from './components/OffMarketSection';
import RechercheSection from './components/RechercheSection';
import PropertyGallery from './components/PropertyGallery';
import VendreSection from './components/VendreSection';
import ContactSection from './components/ContactSection';
import LoginForm from './components/LoginForm';
import Chatbot from './components/Chatbot';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    setIsAdminLoggedIn(adminLoggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    setIsAdminLoggedIn(false);
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  // Simple Admin Login Component
  const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      setTimeout(() => {
        if (password === 'lacremerie2025') {
          localStorage.setItem('adminLoggedIn', 'true');
          handleAdminLoginSuccess();
        } else {
          setError('Mot de passe incorrect');
        }
        setIsLoading(false);
      }, 1000);
    };

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Accès Administrateur
            </h2>
            <p className="text-gray-600 font-light">
              Veuillez entrer votre mot de passe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe administrateur
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors font-medium"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isLoading || !password}
                className="flex-1 bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Vérification...' : 'Accéder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Simple Admin Panel Component
  const AdminPanel = () => {
    const [users] = useState([
      {
        id: '1',
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean.dupont@email.com',
        telephone: '06 12 34 56 78',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        nom: 'Martin',
        prenom: 'Marie',
        email: 'marie.martin@email.com',
        telephone: '06 98 76 54 32',
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
    const [activeTab, setActiveTab] = useState('users');

    const exportCSV = () => {
      const csvContent = [
        'Nom,Prénom,Email,Téléphone,Date',
        ...users.map(user => 
          `${user.nom},${user.prenom},${user.email},${user.telephone},${new Date(user.created_at).toLocaleDateString('fr-FR')}`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inscriptions.csv';
      a.click();
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h1 className="text-xl font-light text-gray-900 dark:text-white">
                    Administration CERCLE PRIVÉ
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gestion complète de votre site
                  </p>
                </div>
              </div>
              <button
                onClick={handleAdminLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                      activeTab === 'users'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>👥</span>
                    <span>Utilisateurs</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('stats')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                      activeTab === 'stats'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>📊</span>
                    <span>Statistiques</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('emails')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-left transition-colors ${
                      activeTab === 'emails'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>📧</span>
                    <span>Emails</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-4">
              {/* Onglet Utilisateurs */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aujourd'hui</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">1</p>
                        </div>
                        <span className="text-2xl">📅</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cette semaine</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                        <span className="text-2xl">📈</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ce mois</p>
                          <p className="text-2xl font-light text-gray-900 dark:text-white">{users.length}</p>
                        </div>
                        <span className="text-2xl">🔔</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Gestion des utilisateurs
                      </h3>
                      <button
                        onClick={exportCSV}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                      >
                        📥 Exporter CSV
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Utilisateurs inscrits ({users.length})
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Nom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Prénom
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Téléphone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                {user.nom}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                {user.prenom}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <a 
                                  href={`mailto:${user.email}`}
                                  className="text-yellow-600 hover:text-yellow-700"
                                >
                                  {user.email}
                                </a>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <a 
                                  href={`tel:${user.telephone}`}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  {user.telephone}
                                </a>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                {new Date(user.created_at).toLocaleDateString('fr-FR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Statistiques */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      📊 Statistiques d'inscription
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-3xl mb-2">📈</div>
                        <div className="text-2xl font-light text-blue-600">{users.length}</div>
                        <div className="text-sm text-blue-600">Total inscriptions</div>
                      </div>
                      <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-3xl mb-2">⭐</div>
                        <div className="text-2xl font-light text-green-600">85%</div>
                        <div className="text-sm text-green-600">Taux de conversion</div>
                      </div>
                      <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-2xl font-light text-purple-600">2:34</div>
                        <div className="text-sm text-purple-600">Temps moyen sur site</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Onglet Emails */}
              {activeTab === 'emails' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                      📧 Configuration des emails
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">Email de bienvenue</h4>
                          <p className="text-sm text-green-600 dark:text-green-400">Envoyé automatiquement à chaque inscription</p>
                        </div>
                        <div className="text-green-600">✅ Actif</div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">Notification admin</h4>
                          <p className="text-sm text-blue-600 dark:text-blue-400">Notification à nicolas.c@lacremerie.fr</p>
                        </div>
                        <div className="text-blue-600">✅ Actif</div>
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

  // Admin panel view
  if (isAdminLoggedIn) {
    return (
      <>
        <AdminPanel />
        <Toaster position="top-right" />
      </>
    );
  }

  // Admin login view
  if (showAdminLogin) {
    return (
      <>
        <AdminLogin />
        <Toaster position="top-right" />
      </>
    );
  }

  // User login view
  if (!isLoggedIn) {
    return (
      <>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Main site view
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Navigation onAdminClick={handleAdminClick} />
        <HeroSection />
        <NotreAdnSection />
        <ServicesSection />
        <OffMarketSection />
        <RechercheSection />
        <PropertyGallery />
        <VendreSection />
        <ContactSection />
        <Chatbot />
        <PWAInstallPrompt />
      </div>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
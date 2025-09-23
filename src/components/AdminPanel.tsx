import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Check, Settings, Users, BarChart3, MessageSquare, Home, Image, FileText, Palette, Shield, Activity, TestTube, Globe, Eye, Database, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import EmailJSSetupGuide from './EmailJSSetupGuide';

// Import des composants admin (lazy loading pour optimisation)
const UserManagement = React.lazy(() => import('./UserManagement'));
const StatsCharts = React.lazy(() => import('./StatsCharts'));
const CRMSystem = React.lazy(() => import('./CRMSystem'));
const PropertyManagement = React.lazy(() => import('./PropertyManagement'));
const ContentManager = React.lazy(() => import('./ContentManager'));
const PresentationImageManager = React.lazy(() => import('./PresentationImageManager'));
const DesignCustomizer = React.lazy(() => import('./DesignCustomizer'));
const AdminUserManagement = React.lazy(() => import('./AdminUserManagement'));
const AdvancedAnalytics = React.lazy(() => import('./AdvancedAnalytics'));
const AuthenticationTester = React.lazy(() => import('./AuthenticationTester'));
const ContentManagementDiagnostic = React.lazy(() => import('./ContentManagementDiagnostic'));
const AuthenticationSecurityAudit = React.lazy(() => import('./AuthenticationSecurityAudit'));
const PrivacyCompliantDashboard = React.lazy(() => import('./PrivacyCompliantDashboard'));
const ContentSyncDashboard = React.lazy(() => import('./ContentSyncDashboard'));

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('localUsers');
    return stored ? JSON.parse(stored) : [];
  });
  const [showEmailSetup, setShowEmailSetup] = useState(false);
  const [pendingEmails, setPendingEmails] = useState(() => {
    const stored = localStorage.getItem('pendingEmails');
    return stored ? JSON.parse(stored) : [];
  });

  // Simuler un utilisateur admin pour les composants qui en ont besoin
  const currentUser = {
    id: '1',
    email: 'nicolas.c@lacremerie.fr',
    nom: 'Crémerie',
    prenom: 'Nicolas',
    role: 'super_admin' as const,
    is_active: true,
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
    created_by: null
  };

  const tabs = [
    { key: 'users', label: 'Utilisateurs', icon: Users },
    { key: 'stats', label: 'Statistiques', icon: BarChart3 },
    { key: 'crm', label: 'CRM', icon: MessageSquare },
    { key: 'properties', label: 'Biens', icon: Home },
    { key: 'content', label: 'Contenu', icon: FileText },
    { key: 'images', label: 'Images', icon: Image },
    { key: 'design', label: 'Design', icon: Palette },
    { key: 'emails', label: 'Emails', icon: Mail },
    { key: 'admin_users', label: 'Admins', icon: Shield },
    { key: 'analytics', label: 'Analytics', icon: Activity },
    { key: 'auth_test', label: 'Test Auth', icon: TestTube },
    { key: 'content_diagnostic', label: 'Diagnostic', icon: Database },
    { key: 'security_audit', label: 'Audit Sécurité', icon: Shield },
    { key: 'privacy_monitoring', label: 'Surveillance', icon: Eye },
    { key: 'sync_dashboard', label: 'Synchronisation', icon: Globe }
  ];

  const clearPendingEmails = () => {
    localStorage.removeItem('pendingEmails');
    setPendingEmails([]);
    toast.success('Emails en attente supprimés');
  };

  const renderTabContent = () => {
    const LoadingSpinner = () => (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-yellow-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Chargement...</span>
      </div>
    );

    return (
      <React.Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (activeTab) {
            case 'users':
              return <UserManagement users={users} onUsersChange={setUsers} />;
            case 'stats':
              return <StatsCharts users={users} />;
            case 'crm':
              return <CRMSystem users={users} />;
            case 'properties':
              return <PropertyManagement />;
            case 'content':
              return <ContentManager />;
            case 'images':
              return <PresentationImageManager />;
            case 'design':
              return <DesignCustomizer />;
            case 'emails':
              return showEmailSetup ? (
                <EmailJSSetupGuide />
              ) : (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      📧 Configuration des Emails Automatiques
                    </h3>
                    
                    {pendingEmails.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                        <h4 className="text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                          📦 {pendingEmails.length} email(s) en attente d'envoi
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {pendingEmails.slice(-5).map((email: any, index: number) => (
                            <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                              <strong>{email.subject}</strong> - {email.to} - {new Date(email.timestamp).toLocaleString('fr-FR')}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={clearPendingEmails}
                          className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
                        >
                          Vider la liste
                        </button>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                          📧 État actuel du système d'emails
                        </h4>
                        <ul className="text-blue-700 dark:text-blue-300 space-y-1 text-sm">
                          <li>✅ Emails de connexion (avec IP) - Configuré</li>
                          <li>✅ Emails de recherche immobilière - Configuré</li>
                          <li>✅ Emails de demande de vente - Configuré</li>
                          <li>✅ Emails de prise de RDV - Configuré</li>
                          <li>✅ Emails de contact - Configuré</li>
                          <li>⚠️ Service d'envoi - À configurer (EmailJS)</li>
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => setShowEmailSetup(true)}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
                      >
                        🚀 Configurer EmailJS pour l'envoi automatique
                      </button>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p><strong>Destinataires configurés :</strong></p>
                        <p>• Principal : nicolas.c@lacremerie.fr</p>
                        <p>• Copie cachée : quentin@lacremerie.fr</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'admin_users':
              return <AdminUserManagement currentUser={currentUser} />;
            case 'analytics':
              return <AdvancedAnalytics users={users} />;
            case 'auth_test':
              return <AuthenticationTester />;
            case 'content_diagnostic':
              return <ContentManagementDiagnostic />;
            case 'security_audit':
              return <AuthenticationSecurityAudit />;
            case 'privacy_monitoring':
              return <PrivacyCompliantDashboard />;
            case 'sync_dashboard':
              return <ContentSyncDashboard />;
            default:
              return <UserManagement users={users} onUsersChange={setUsers} />;
          }
        })()}
      </React.Suspense>
    );
  };

  if (showEmailSetup && activeTab === 'emails') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-light text-gray-900 dark:text-white">
                CERCLE PRIVÉ - Configuration EmailJS
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowEmailSetup(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Retour au panel
                </button>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
        <EmailJSSetupGuide />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-light text-gray-900 dark:text-white">
              CERCLE PRIVÉ - Administration
            </h1>
            <div className="flex items-center space-x-4">
              {pendingEmails.length > 0 && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-full text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{pendingEmails.length} email(s) en attente</span>
                </div>
              )}
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === key
                      ? 'bg-yellow-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

interface TimeSlot {
  time: string;
  available: boolean;
}

const AppointmentBooking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Créneaux horaires disponibles
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: true },
    { time: '17:00', available: false }
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
    setSelectedTime(''); // Reset time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Veuillez sélectionner une date et une heure');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'envoi de demande de RDV
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici vous intégreriez votre système de calendrier (Google Calendar, Calendly, etc.)
      console.log('Demande de RDV:', {
        date: selectedDate,
        time: selectedTime,
        client: formData
      });
      
      // Envoyer une notification email à Nicolas et Quentin
      try {
        const { EmailService } = await import('../services/emailService');
        const emailSent = await EmailService.sendAppointmentNotification({
          ...formData,
          selectedDate,
          selectedTime
        });
        
        if (emailSent) {
          console.log('✅ Email de RDV envoyé avec succès');
        } else {
          console.warn('⚠️ Problème envoi email de RDV');
          toast.error('📧 Email en attente d\'envoi manuel. Vérifiez la configuration.', {
            duration: 6000
          });
        }
      } catch (emailError) {
        console.error('Erreur envoi notification RDV:', emailError);
        toast.error('📧 Problème d\'envoi email. Notification stockée pour envoi manuel.', {
          duration: 6000
        });
      }

      setIsSuccess(true);
      toast.success('Demande de rendez-vous envoyée avec succès !');
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center"
      >
        <Check className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
          Demande envoyée !
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Nous vous contacterons sous 24h pour confirmer votre rendez-vous.
        </p>
        <button
          onClick={() => {
            setIsSuccess(false);
            setSelectedDate(null);
            setSelectedTime('');
            setFormData({
              nom: '',
              prenom: '',
              email: '',
              telephone: '',
              message: ''
            });
          }}
          className="bg-yellow-600 text-white px-6 py-3 rounded-md hover:bg-yellow-700 transition-colors"
        >
          Prendre un autre rendez-vous
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
      <div className="text-center mb-8">
        <Calendar className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-2">
          Prendre Rendez-vous
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Planifiez une consultation personnalisée avec nos experts
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prénom *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Sélection de date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date souhaitée *
          </label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            onChange={handleDateChange}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Sélection d'heure */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Heure souhaitée *
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`p-3 rounded-md text-sm font-medium transition-colors ${
                    selectedTime === slot.time
                      ? 'bg-yellow-600 text-white'
                      : slot.available
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  {slot.time}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message (optionnel)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Décrivez votre projet immobilier..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedDate || !selectedTime}
          className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Envoi en cours...' : 'Confirmer le rendez-vous'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
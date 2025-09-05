import React, { useState } from 'react';
import { Mail, Send, Settings, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface EmailSettingsProps {
  onClose: () => void;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({ onClose }) => {
  const [emailConfig, setEmailConfig] = useState({
    autoReply: true,
    welcomeEmail: true,
    adminNotification: true,
    emailTemplate: `Bonjour {prenom} {nom},

Merci pour votre inscription sur OFF MARKET.

Nous sommes ravis de vous compter parmi nos clients privilégiés. Vous recevrez prochainement des informations exclusives sur nos biens immobiliers de prestige en off-market.

Notre équipe vous contactera sous peu pour discuter de vos projets immobiliers.

Cordialement,
L'équipe OFF MARKET

---
Ce message a été envoyé automatiquement. Pour toute question, contactez-nous à nicolas.c@lacremerie.fr`
  });

  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('emailSettings', JSON.stringify(emailConfig));
    toast.success('Paramètres email sauvegardés');
    onClose();
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Veuillez entrer une adresse email de test');
      return;
    }

    setIsSendingTest(true);
    
    // Simulation d'envoi d'email (en production, utilisez un service d'email)
    setTimeout(() => {
      toast.success(`Email de test envoyé à ${testEmail}`);
      setIsSendingTest(false);
      setTestEmail('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-medium text-gray-900">
                Paramètres Email
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Configuration automatique */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Emails automatiques
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={emailConfig.autoReply}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, autoReply: e.target.checked }))}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-700">Réponse automatique aux nouvelles inscriptions</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={emailConfig.welcomeEmail}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, welcomeEmail: e.target.checked }))}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-700">Email de bienvenue personnalisé</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={emailConfig.adminNotification}
                  onChange={(e) => setEmailConfig(prev => ({ ...prev, adminNotification: e.target.checked }))}
                  className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-gray-700">Notification admin pour chaque inscription</span>
              </label>
            </div>
          </div>

          {/* Template d'email */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Template d'email de bienvenue
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Variables disponibles : {'{prenom}'}, {'{nom}'}, {'{email}'}, {'{telephone}'}
            </p>
            <textarea
              value={emailConfig.emailTemplate}
              onChange={(e) => setEmailConfig(prev => ({ ...prev, emailTemplate: e.target.value }))}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-mono text-sm"
              placeholder="Votre template d'email..."
            />
          </div>

          {/* Test d'email */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Tester l'envoi d'email
            </h3>
            <div className="flex space-x-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@test.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
              <button
                onClick={handleSendTestEmail}
                disabled={isSendingTest || !testEmail}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSendingTest ? 'animate-pulse' : ''}`} />
                <span>{isSendingTest ? 'Envoi...' : 'Tester'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSaveSettings}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;
import React, { useState } from 'react';
import { Mail, Copy, CheckCircle, ExternalLink, Settings, Key, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const EmailJSSetupGuide: React.FC = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    userId: '',
    serviceId: '',
    templateId: ''
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers !');
  };

  const templateHTML = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
  <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #D97706;">
      <h1 style="color: #D97706; font-size: 28px; font-weight: 300; letter-spacing: 2px; margin: 0;">
        CERCLE PRIVÉ
      </h1>
      <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
        {{subject}}
      </p>
    </div>

    <!-- Contenu principal -->
    <div style="margin-bottom: 30px;">
      <h2 style="color: #333; font-size: 20px; margin-bottom: 20px;">
        {{email_subject}}
      </h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
        <h3 style="color: #D97706; font-size: 16px; margin-bottom: 15px;">
          📋 Informations de contact :
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold; width: 120px;">Nom :</td>
            <td style="padding: 8px 0; color: #333;">{{user_nom}} {{user_prenom}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Email :</td>
            <td style="padding: 8px 0; color: #333;">{{user_email}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Téléphone :</td>
            <td style="padding: 8px 0; color: #333;">{{user_telephone}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Adresse IP :</td>
            <td style="padding: 8px 0; color: #333;">{{user_ip}}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666; font-weight: bold;">Date/Heure :</td>
            <td style="padding: 8px 0; color: #333;">{{timestamp}}</td>
          </tr>
        </table>
      </div>

      <!-- Message ou détails spécifiques -->
      <div style="background: white; border: 1px solid #e0e0e0; padding: 20px; border-radius: 6px;">
        <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">
          💬 Détails de la demande :
        </h3>
        <div style="color: #555; line-height: 1.6;">
          {{message_content}}
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 12px;">
      <p>Email automatique envoyé depuis le site CERCLE PRIVÉ</p>
      <p>{{website_url}}</p>
    </div>
  </div>
</div>
  `.trim();

  const updateEmailServiceConfig = () => {
    if (!config.userId || !config.serviceId || !config.templateId) {
      toast.error('Veuillez remplir tous les champs de configuration');
      return;
    }

    const configCode = `
// Dans src/services/emailService.ts, remplacez la configuration :
private static readonly EMAILJS_CONFIG = {
  USER_ID: '${config.userId}',
  SERVICE_ID: '${config.serviceId}',
  TEMPLATE_ID: '${config.templateId}'
};`;

    copyToClipboard(configCode);
    toast.success('Configuration copiée ! Collez-la dans emailService.ts');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
          📧 Configuration EmailJS
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Guide complet pour recevoir les emails automatiques du site
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-12 h-1 ${
                step > stepNum ? 'bg-yellow-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Créer un compte EmailJS */}
      {step === 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Globe className="w-6 h-6 text-blue-600 mr-3" />
            Étape 1 : Créer un compte EmailJS
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
                🎯 Pourquoi EmailJS ?
              </h3>
              <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                <li>• <strong>Gratuit</strong> jusqu'à 200 emails/mois</li>
                <li>• <strong>Simple</strong> à configurer</li>
                <li>• <strong>Sécurisé</strong> - Pas besoin de serveur</li>
                <li>• <strong>Fiable</strong> - Service professionnel</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                📝 Instructions :
              </h3>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">1</span>
                  <div>
                    <strong>Allez sur EmailJS :</strong>
                    <a 
                      href="https://www.emailjs.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      www.emailjs.com <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">2</span>
                  <span>Cliquez sur <strong>"Sign Up"</strong> pour créer un compte gratuit</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">3</span>
                  <span>Utilisez votre email <strong>nicolas.c@lacremerie.fr</strong> pour l'inscription</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">4</span>
                  <span>Confirmez votre email et connectez-vous</span>
                </li>
              </ol>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors font-medium"
            >
              J'ai créé mon compte EmailJS →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Configurer le service email */}
      {step === 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Settings className="w-6 h-6 text-green-600 mr-3" />
            Étape 2 : Configurer le service email
          </h2>
          
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-4">
                📧 Configuration du service
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                Vous allez connecter votre Gmail (ou autre) pour envoyer les emails automatiques.
              </p>
            </div>

            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">1</span>
                <div>
                  <strong>Dans votre dashboard EmailJS, cliquez sur "Email Services"</strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">2</span>
                <div>
                  <strong>Cliquez "Add New Service"</strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">3</span>
                <div>
                  <strong>Choisissez "Gmail" (recommandé)</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Ou Outlook si vous préférez
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">4</span>
                <div>
                  <strong>Connectez votre compte Gmail</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Autorisez EmailJS à envoyer des emails depuis votre compte
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">5</span>
                <div>
                  <strong>Notez votre "Service ID"</strong>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Il ressemble à : service_xxxxxxx
                  </p>
                </div>
              </li>
            </ol>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Service configuré →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Créer le template */}
      {step === 3 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Mail className="w-6 h-6 text-purple-600 mr-3" />
            Étape 3 : Créer le template d'email
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-purple-800 dark:text-purple-200 mb-4">
                📝 Template d'email personnalisé
              </h3>
              <p className="text-purple-700 dark:text-purple-300">
                Ce template sera utilisé pour tous les emails automatiques du site.
              </p>
            </div>

            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">1</span>
                <div>
                  <strong>Allez dans "Email Templates"</strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">2</span>
                <div>
                  <strong>Cliquez "Create New Template"</strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">3</span>
                <div>
                  <strong>Nommez le template :</strong> "CERCLE PRIVE Notifications"
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">4</span>
                <div>
                  <strong>Copiez ce template HTML :</strong>
                  <div className="mt-3 relative">
                    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-xs overflow-x-auto max-h-40">
                      {templateHTML}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(templateHTML)}
                      className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      title="Copier le template"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-1">5</span>
                <div>
                  <strong>Sauvegardez le template et notez le "Template ID"</strong>
                </div>
              </li>
            </ol>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 transition-colors font-medium"
              >
                Template créé →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Configuration finale */}
      {step === 4 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-6 flex items-center">
            <Key className="w-6 h-6 text-red-600 mr-3" />
            Étape 4 : Configuration finale
          </h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-4">
                🔑 Récupérer vos clés EmailJS
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">
                Vous devez récupérer 3 informations depuis votre dashboard EmailJS :
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  👤 User ID
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Dans "Account" → "API Keys"
                </p>
                <input
                  type="text"
                  value={config.userId}
                  onChange={(e) => setConfig(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="user_xxxxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  🔧 Service ID
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Dans "Email Services"
                </p>
                <input
                  type="text"
                  value={config.serviceId}
                  onChange={(e) => setConfig(prev => ({ ...prev, serviceId: e.target.value }))}
                  placeholder="service_xxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  📧 Template ID
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Dans "Email Templates"
                </p>
                <input
                  type="text"
                  value={config.templateId}
                  onChange={(e) => setConfig(prev => ({ ...prev, templateId: e.target.value }))}
                  placeholder="template_xxxxxxx"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-4">
                🔧 Appliquer la configuration
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                Une fois que vous avez rempli les 3 champs ci-dessus, cliquez sur le bouton pour générer le code de configuration.
              </p>
              
              <button
                onClick={updateEmailServiceConfig}
                disabled={!config.userId || !config.serviceId || !config.templateId}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📋 Copier la configuration dans le presse-papiers
              </button>
              
              {config.userId && config.serviceId && config.templateId && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-md border">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Étapes finales :</strong>
                  </p>
                  <ol className="text-sm space-y-1">
                    <li>1. Copiez la configuration (bouton ci-dessus)</li>
                    <li>2. Ouvrez le fichier <code>src/services/emailService.ts</code></li>
                    <li>3. Remplacez la section EMAILJS_CONFIG par le code copié</li>
                    <li>4. Sauvegardez le fichier</li>
                    <li>5. Testez en vous inscrivant sur le site !</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                ← Retour
              </button>
              <button
                onClick={() => {
                  toast.success('🎉 Configuration EmailJS terminée ! Testez maintenant en vous inscrivant sur le site.');
                }}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                ✅ Configuration terminée !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aide et support */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          🆘 Besoin d'aide ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">📚 Documentation EmailJS :</h4>
            <a 
              href="https://www.emailjs.com/docs/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Guide officiel <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">🎥 Tutoriel vidéo :</h4>
            <a 
              href="https://www.youtube.com/results?search_query=emailjs+tutorial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Tutoriels YouTube <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Test de configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          🧪 Tester la configuration
        </h3>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Une fois EmailJS configuré, testez le système :
          </p>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>1. Allez sur votre site CERCLE PRIVÉ</li>
            <li>2. Inscrivez-vous avec un nouvel email</li>
            <li>3. Vérifiez votre boîte mail (nicolas.c@lacremerie.fr)</li>
            <li>4. Vous devriez recevoir un email avec les infos de connexion + IP</li>
          </ol>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-700 dark:text-green-300 text-sm">
              <strong>✅ Si vous recevez l'email :</strong> Le système fonctionne parfaitement !<br/>
              <strong>❌ Si pas d'email :</strong> Vérifiez vos spams ou reconfigurez EmailJS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailJSSetupGuide;
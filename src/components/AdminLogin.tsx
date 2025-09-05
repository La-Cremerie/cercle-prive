import React, { useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mots de passe admin simples (en production, utilisez une vraie authentification)
  const ADMIN_PASSWORDS = {
    'nicolas.c@lacremerie.fr': 'lacremerie2025',
    'quentin@lacremerie.fr': '123'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Récupérer l'email admin depuis localStorage ou utiliser nicolas par défaut
    const adminEmail = localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr';
    const expectedPassword = ADMIN_PASSWORDS[adminEmail as keyof typeof ADMIN_PASSWORDS] || ADMIN_PASSWORDS['nicolas.c@lacremerie.fr'];

    // Simulation d'une vérification
    setTimeout(() => {
      if (password === expectedPassword) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentAdminEmail', adminEmail);
        onLoginSuccess();
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
          <Shield className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-light text-gray-900 mb-2">
            Accès Administrateur
          </h2>
          <p className="text-gray-600 font-light mb-4">
            Compte: {localStorage.getItem('currentAdminEmail') || 'nicolas.c@lacremerie.fr'}
          </p>
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
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors pr-12"
                placeholder="Entrez le mot de passe"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onBack}
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

        <p className="text-xs text-gray-500 text-center mt-6 font-light">
          Accès réservé aux administrateurs autorisés
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
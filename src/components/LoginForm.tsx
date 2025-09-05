import React, { useState } from 'react';
import { User, Phone, Mail, UserCheck, Eye, EyeOff } from 'lucide-react';
import { UserService } from '../services/userService';
import { EmailService } from '../services/emailService';
import { supabase } from '../lib/supabase';
import type { NewUserRegistration } from '../types/database';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

interface FormData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    telephone: '',
    email: ''
  });
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.nom.trim()) {
      setError('Le nom est requis');
      return false;
    }
    if (!formData.prenom.trim()) {
      setError('Le prénom est requis');
      return false;
    }
    if (!formData.telephone.trim()) {
      setError('Le téléphone est requis');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Format d\'email invalide');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Mode connexion
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password,
        });

        if (signInError) {
          throw new Error('Email ou mot de passe incorrect');
        }

        onLoginSuccess();
      } else {
        // Mode inscription
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await UserService.getUserByEmail(formData.email);
        
        if (existingUser) {
          toast.success('Inscription réussie ! Bienvenue dans le Cercle Privé.');
        }

        // Créer le compte Supabase Auth
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password,
        });

        if (signUpError) {
          throw signUpError;
        }

        // Nouvel utilisateur - procéder à l'inscription
        const userData: Omit<NewUserRegistration, 'id' | 'created_at'> = {
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          email: formData.email
        };

        const registeredUser = await UserService.registerUser(userData);

        // Store user data locally
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(registeredUser));
        
        // Envoyer les emails automatiques
        await EmailService.sendWelcomeEmail(registeredUser);
        await EmailService.sendAdminNotification(registeredUser);
        
        setSuccess(true);
        toast.success('Inscription réussie ! Bienvenue dans le Cercle Privé.');
        
        // Redirect after a short delay
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('login.errors.general');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="mb-6">
            <UserCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Inscription réussie !
            </h2>
            <p className="text-gray-600 font-light">
              Redirection en cours...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-gray-900 tracking-wider">
            CERCLE PRIVÉ
          </h1>
          <p className="text-sm text-gray-600 font-light mt-2">
            Bienvenue dans votre espace dédié à l'immobilier en toute discrétion
          </p>
        </div>

        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Inscription
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Connexion
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                      placeholder="Votre numéro de téléphone"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Inscription en cours...' : 'Accéder au site'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6 font-light">
          En vous inscrivant, vous acceptez de recevoir des informations sur nos biens immobiliers de prestige.
          
          {isLogin && (
            <span className="block mt-2">
              Pas encore de compte ?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-yellow-600 hover:text-yellow-700 underline"
              >
                S'inscrire ici
              </button>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
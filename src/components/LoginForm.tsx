import React, { useState } from 'react';
import { User, Phone, Mail, UserCheck, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { UserService } from '../services/userService';
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
  const [isLogin, setIsLogin] = useState(true); // Default to login mode
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Vérifier immédiatement si l'utilisateur est déjà connecté
  React.useEffect(() => {
    try {
      const userLoggedIn = localStorage.getItem('userLoggedIn');
      if (userLoggedIn === 'true') {
        // Connexion immédiate si déjà connecté
        onLoginSuccess();
      }
    } catch (error) {
      console.warn('Erreur lors de la vérification de connexion:', error);
      // Continuer normalement même en cas d'erreur localStorage
    }
  }, [onLoginSuccess]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    // In connection mode, only email and password are required
    if (!isLogin) {
      if (!formData.nom.trim()) {
        setError('Name is required');
        return false;
      }
      if (!formData.prenom.trim()) {
        setError('First name is required');
        return false;
      }
      if (!formData.telephone.trim()) {
        setError('Phone number is required');
        return false;
      }
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    
    console.log('Login form submission started');

    try {
      if (isLogin) {
        console.log('Connection mode - authenticating user');
        // Connection mode - authenticate existing user
        const user = await UserService.getUserByEmail(formData.email);
        
        if (!user) {
          throw new Error('No account found with this email address. Please register first or check your email.');
        }
        
        // For demo purposes, we'll accept any password for existing users
        // In production, you would verify against a hashed password
        if (!password || password.length < 1) {
          throw new Error('Password is required');
        }
        
        console.log('User authenticated successfully');
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(user));
        
        toast.success(`Welcome back, ${user.prenom}!`);
        
        onLoginSuccess();
      } else {
        console.log('Registration mode - creating new user');
        // Registration mode
        // Check if user already exists
        const existingUser = await UserService.getUserByEmail(formData.email);
        
        if (existingUser) {
          throw new Error('An account with this email already exists. Please use the connection tab.');
        }

        console.log('Creating new user');
        // New user - proceed with registration
        const userData: Omit<NewUserRegistration, 'id' | 'created_at'> = {
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          email: formData.email
        };

        const registeredUser = await UserService.registerUser(userData);

        // Store user data locally
        console.log('User registered successfully, storing session');
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(registeredUser));
        
        // Envoyer les emails automatiques (simulation)
        try {
          console.log('Attempting to send welcome emails');
          const { EmailService } = await import('../services/emailService');
          
          // Vérifier que les emails sont activés
          const emailSettings = EmailService.getEmailSettings();
          console.log('Email settings:', emailSettings);
          
          if (emailSettings.welcomeEmail) {
            await EmailService.sendWelcomeEmail(registeredUser);
            console.log('Welcome email sent successfully');
          }
          
          if (emailSettings.adminNotification) {
            await EmailService.sendAdminNotification(registeredUser);
            console.log('Admin notification sent successfully');
          }
          
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi des emails:', emailError);
          // Afficher l'erreur à l'utilisateur pour debug
          toast.error('Erreur envoi email: ' + (emailError instanceof Error ? emailError.message : 'Erreur inconnue'));
          // Ne pas faire échouer l'inscription pour une erreur d'email
        }
        
        setSuccess(true);
        toast.success('Registration successful! Welcome to Cercle Privé.');
        
        // Redirect after a short delay
        setTimeout(() => {
          console.log('Redirecting to main site');
          onLoginSuccess();
        }, 1500);
      }

    } catch (err) {
      console.error('Login/Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('Login form submission completed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8 text-center">
          <div className="mb-6">
            <UserCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Registration successful!
            </h2>
            <p className="text-gray-600 font-light">
              Redirecting...
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
            Welcome to your dedicated space for discreet real estate
          </p>
        </div>

        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              isLogin
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Connection</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
              !isLogin
                ? 'bg-yellow-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Registration</span>
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
                    Last Name *
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
                      placeholder="Your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
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
                      placeholder="Your first name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
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
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
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
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors pr-12"
                  placeholder="Your password"
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
            {isLoading ? (isLogin ? 'Connecting...' : 'Registering...') : (isLogin ? 'Connect to Site' : 'Register & Access')}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6 font-light">
          By registering, you agree to receive information about our luxury real estate properties.
        </p>
        
        {!isLogin && (
          <p className="text-xs text-gray-500 text-center mt-4">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className="text-yellow-600 hover:text-yellow-700 underline"
            >
              Connect here
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
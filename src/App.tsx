import React, { useState, useEffect } from 'react';
import { Calculator, GitCompare as Compare, Bell } from 'lucide-react';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import RentabilityCalculator from './components/RentabilityCalculator';
import PropertyComparator from './components/PropertyComparator';
import PropertyAlerts from './components/PropertyAlerts';
import { Toaster } from 'react-hot-toast';

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
    return <AdminPanel onLogout={handleAdminLogout} />;
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
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Navigation */}
        <nav className="bg-black/20 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-light tracking-wider">CERCLE PRIVÉ</h1>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#concept" className="text-sm font-light hover:text-yellow-500 transition-colors">CONCEPT</a>
                <a href="#services" className="text-sm font-light hover:text-yellow-500 transition-colors">SERVICES</a>
                <a href="#biens" className="text-sm font-light hover:text-yellow-500 transition-colors">BIENS</a>
                <a href="#contact" className="text-sm font-light hover:text-yellow-500 transition-colors">CONTACT</a>
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
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920)'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
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
        <section id="concept" className="py-20 bg-white text-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-light text-yellow-600 mb-8">CONCEPT</h2>
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    Donnez de la puissance à votre capital, construisez un patrimoine solide.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Notre approche d'investissement vous permet de transformer un capital financier existant 
                    en une rentabilité complémentaire, tout en créant un véritable effet de levier patrimonial.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                      Acquisition immobilière rigoureusement sélectionnée
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                      Travaux et ameublement pensés pour la valorisation
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3"></span>
                      Financement et structuration patrimoniale sur mesure
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
        <section id="services" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-gray-900 mb-8">ACCOMPAGNEMENT PERSONNALISÉ</h2>
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
                <div key={index} className="bg-white p-8 border border-gray-200 hover:border-yellow-600/30 transition-all">
                  <h3 className="text-xl font-light text-gray-900 mb-4">{service.title}</h3>
                  <div className="w-12 h-px bg-yellow-600/30 mb-4"></div>
                  <p className="text-gray-600 font-light leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Biens Section */}
        <section id="biens" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-light text-yellow-600 mb-8">BIENS D'EXCEPTION</h2>
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
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img 
                    src={property.image}
                    alt={property.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-light text-gray-900 mb-2">{property.name}</h3>
                    <p className="text-gray-600 mb-4">{property.location}</p>
                    <div className="text-xl font-medium text-yellow-600">{property.price}</div>
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
              <h3 className="text-2xl font-light text-gray-900 mb-8">Outils d'Investissement</h3>
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
        <section id="contact" className="py-20 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-white mb-8">CONTACT</h2>
            <div className="w-24 h-px bg-yellow-600 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-xl font-medium text-white mb-4">Téléphone</h3>
                <a href="tel:+33652913556" className="text-gray-300 hover:text-white transition-colors">
                  +33 6 52 91 35 56
                </a>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
                <h3 className="text-xl font-medium text-white mb-4">Email</h3>
                <a href="mailto:nicolas.c@lacremerie.fr" className="text-gray-300 hover:text-white transition-colors">
                  nicolas.c@lacremerie.fr
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
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
    </>
  );
}

export default App;
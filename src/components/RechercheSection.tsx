import React, { useState } from 'react';
import { Search, Home, MapPin, Euro, User, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RechercheSection: React.FC = () => {
  const [formData, setFormData] = useState({
    // Que recherchez-vous ?
    typeBien: [] as string[],
    
    // Surfaces
    surfaceMin: '',
    nombreChambresMin: '',
    nombreSdbMin: '',
    
    // Extérieur
    exterieur: '',
    surfaceExtMin: '',
    
    // Stationnement
    stationnement: '',
    
    // Autres critères
    autresCriteres: [] as string[],
    
    // Emplacement
    villesRecherche: '',
    
    // Budget
    budgetMin: '',
    
    // Financement
    financement: '',
    pret: '',
    bancaire: '',
    
    // Coordonnées
    prenom: '',
    nom: '',
    email: '',
    telephone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const typesBien = [
    'Villa', 'Appartement', 'Immeuble', 'Hôtel particulier', 'Atelier / Loft', 'Maison', 'Château', 'Terrain', 'Viager', 'Autre'
  ];

  const autresCriteresOptions = [
    'Aucune mitoyenneté', 'Sans travaux', 'Orienté sud', 'Piscine', 'Ascenseur', 'Aire d\'envol'
  ];

  const [autreLibre, setAutreLibre] = useState('');

  const handleCheckboxChange = (category: 'typeBien' | 'autresCriteres', value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.nom || !formData.email || !formData.telephone) {
      toast.error('Veuillez remplir vos coordonnées');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'envoi de recherche
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Recherche immobilière:', formData);
      
      setIsSuccess(true);
      toast.success('Votre recherche a été envoyée avec succès !');
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de votre recherche');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="recherche" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-12"
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-gray-900 dark:text-white mb-4">
              Recherche enregistrée !
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Nous analysons votre demande et vous contacterons dès qu'un bien correspondant à vos critères sera disponible.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Contact sous 48h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Alertes personnalisées</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="recherche" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-light text-yellow-600 tracking-wide mb-8">
            Trouvez votre bien d'exception
          </h2>
          <div className="w-24 h-px bg-yellow-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            Recherche personnalisée parmi nos propriétés de prestige
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Que recherchez-vous ? */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Que recherchez-vous ?
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {typesBien.map((type) => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.typeBien.includes(type)}
                      onChange={() => handleCheckboxChange('typeBien', type)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Surfaces */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Surfaces
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Surface min. (en m²)
                  </label>
                  <input
                    type="number"
                    name="surfaceMin"
                    value={formData.surfaceMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de chambres min.
                  </label>
                  <input
                    type="number"
                    name="nombreChambresMin"
                    value={formData.nombreChambresMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de sdb min.
                  </label>
                  <input
                    type="number"
                    name="nombreSdbMin"
                    value={formData.nombreSdbMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Extérieur */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Extérieur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Type d'extérieur
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exterieur"
                        value="oui"
                        checked={formData.exterieur === 'oui'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exterieur"
                        value="pas-important"
                        checked={formData.exterieur === 'pas-important'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Pas important</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Surface ext. (en m²)
                  </label>
                  <input
                    type="number"
                    name="surfaceExtMin"
                    value={formData.surfaceExtMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Stationnement
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="stationnement"
                        value="oui"
                        checked={formData.stationnement === 'oui'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="stationnement"
                        value="ferme"
                        checked={formData.stationnement === 'ferme'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Fermé</span>
                    </label>
                    <label className="flex items-center space-x-2 md:col-span-2">
                      <input
                        type="radio"
                        name="stationnement"
                        value="pas-important"
                        checked={formData.stationnement === 'pas-important'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Pas important</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Autres critères indispensables */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Autres critères indispensables
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {autresCriteresOptions.map((critere) => (
                  <label key={critere} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.autresCriteres.includes(critere)}
                      onChange={() => handleCheckboxChange('autresCriteres', critere)}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">{critere}</span>
                  </label>
                ))}
                  <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.autresCriteres.includes('Vue mer')}
                      onChange={() => handleCheckboxChange('autresCriteres', 'Vue mer')}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Vue mer</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.autresCriteres.includes('Pleine vue mer')}
                      onChange={() => handleCheckboxChange('autresCriteres', 'Pleine vue mer')}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Pleine vue mer</span>
                  </label>
                </div>
                
                {/* Autre critère libre */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={formData.autresCriteres.includes('Autre: ' + autreLibre) && autreLibre.trim() !== ''}
                      onChange={(e) => {
                        if (e.target.checked && autreLibre.trim()) {
                          handleCheckboxChange('autresCriteres', 'Autre: ' + autreLibre);
                        } else if (!e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            autresCriteres: prev.autresCriteres.filter(item => !item.startsWith('Autre:'))
                          }));
                        }
                      }}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <span className="text-xs text-gray-700 dark:text-gray-300">Autre :</span>
                  </label>
                  <input
                    type="text"
                    value={autreLibre}
                    onChange={(e) => {
                      setAutreLibre(e.target.value);
                      // Mettre à jour automatiquement la liste si la case est cochée
                      if (formData.autresCriteres.some(item => item.startsWith('Autre:'))) {
                        setFormData(prev => ({
                          ...prev,
                          autresCriteres: [
                            ...prev.autresCriteres.filter(item => !item.startsWith('Autre:')),
                            ...(e.target.value.trim() ? ['Autre: ' + e.target.value] : [])
                          ]
                        }));
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Spécifiez votre critère personnalisé..."
                  />
                </div>
              </div>
            </div>

            {/* Emplacement et Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Emplacement
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Villes ou codes postaux de recherche (plusieurs villes possibles)
                  </label>
                  <textarea
                    name="villesRecherche"
                    value={formData.villesRecherche}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Cannes, Saint-Tropez, Monaco, 06400, 83990..."
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Budget
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget maximum (hors frais de notaire)
                  </label>
                  <input
                    type="text"
                    name="budgetMin"
                    value={formData.budgetMin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="2 500 000 €"
                  />
                </div>
              </div>
            </div>

            {/* Votre financement */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Votre financement
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Allez-vous faire un prêt pour cet achat ?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="pret"
                          value="oui"
                          checked={formData.pret === 'oui'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="pret"
                          value="non"
                          checked={formData.pret === 'non'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Avez-vous validé votre financement par un banquier ou un courtier ?
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="bancaire"
                          value="oui"
                          checked={formData.bancaire === 'oui'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Oui</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="bancaire"
                          value="non"
                          checked={formData.bancaire === 'non'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Non</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vos coordonnées */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Vos coordonnées
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className={`w-5 h-5 ${isSubmitting ? 'animate-pulse' : ''}`} />
              <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer ma recherche'}</span>
            </button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6">
            Recherche gratuite et confidentielle. Nous vous contacterons uniquement si nous avons des biens correspondant à vos critères.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RechercheSection;
import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
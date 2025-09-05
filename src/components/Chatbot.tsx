import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'action';
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bienvenue dans le Cercle Privé ! 🏛️ Je suis votre assistant personnel dédié à l\'immobilier de prestige. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Système de réponses intelligent avec contexte
  const intelligentResponses: { [key: string]: { response: string; suggestions?: string[] } } = {
    'bonjour': {
      response: 'Bonjour ! 👋 Bienvenue sur notre plateforme exclusive. Je peux vous renseigner sur nos biens d\'exception, nos services d\'accompagnement, ou vous aider à planifier un rendez-vous.',
      suggestions: ['Voir les biens disponibles', 'Prendre rendez-vous', 'En savoir plus sur vos services']
    },
    'prix': {
      response: 'Nos biens d\'exception sont proposés dans une gamme de 2 à 15 millions d\'euros. 💰 Chaque propriété est unique et sélectionnée pour son potentiel de valorisation. Souhaitez-vous voir notre catalogue actuel ?',
      suggestions: ['Voir le catalogue', 'Calculer la rentabilité', 'Demander une estimation']
    },
    'cercle': {
      response: 'Le Cercle Privé est notre approche exclusive de l\'immobilier de prestige. 🎯 Nous vous accompagnons dans la construction d\'un patrimoine solide avec un service sur-mesure du premier jour à la revente.',
      suggestions: ['En savoir plus sur le concept', 'Voir nos services', 'Prendre rendez-vous']
    },
    'investir': {
      response: 'Nous proposons un accompagnement complet : acquisition, travaux, ameublement et revente optimisée pour maximiser votre rendement. 📈 Notre approche clé en main vous garantit sérénité et performance.',
      suggestions: ['Calculer un rendement', 'Voir nos réalisations', 'Planifier une consultation']
    },
    'rendez-vous': {
      response: 'Pour planifier une consultation personnalisée avec nos experts, vous pouvez : 📅\n• M\'écrire à nicolas.c@lacremerie.fr\n• M\'appeler au +33 6 52 91 35 56\n• Utiliser notre formulaire de contact',
      suggestions: ['Envoyer un email', 'Voir le formulaire de contact', 'En savoir plus']
    },
    'off-market': {
      response: 'L\'off-market consiste à proposer des biens sans publicité publique. 🔒 Cela garantit discrétion totale, exclusivité, et permet souvent une valorisation optimale grâce à l\'effet de rareté.',
      suggestions: ['Pourquoi choisir l\'off-market ?', 'Voir nos biens exclusifs', 'Vendre en off-market']
    },
    'biens': {
      response: 'Nous avons actuellement une sélection de villas, penthouses et propriétés d\'exception sur la Côte d\'Azur. 🏖️ Chaque bien offre des rendements attractifs et un potentiel de valorisation unique.',
      suggestions: ['Voir la galerie', 'Filtrer par type', 'Calculer la rentabilité']
    },
    'contact': {
      response: 'Vous pouvez nous contacter : 📞\n• Email : nicolas.c@lacremerie.fr\n• Téléphone : +33 6 52 91 35 56\n• Nous répondons sous 24h maximum',
      suggestions: ['Envoyer un email', 'Programmer un appel', 'Voir nos horaires']
    },
    'services': {
      response: 'Nos services incluent : 🛠️\n• Pack immobilier clé en main\n• Conciergerie de prestige\n• Architecture & design sur-mesure\n• Services personnalisés\n\nTout pour un accompagnement d\'exception !',
      suggestions: ['Détails des services', 'Demander un devis', 'Voir nos réalisations']
    },
    'vendre': {
      response: 'Pour vendre votre bien en off-market : 🏡\n• Estimation gratuite et confidentielle\n• Stratégie de vente sur-mesure\n• Réseau d\'acheteurs qualifiés\n• Accompagnement complet jusqu\'à la signature',
      suggestions: ['Demander une estimation', 'En savoir plus', 'Voir le processus']
    },
    'recherche': {
      response: 'Notre service de recherche personnalisée vous donne accès à : 🔍\n• Biens exclusifs non publiés\n• Alertes sur-mesure\n• Accompagnement dans vos critères\n• Négociation experte',
      suggestions: ['Créer une recherche', 'Voir les critères', 'Planifier une consultation']
    },
    'default': {
      response: 'Je comprends votre question. 🤔 Pour un accompagnement personnalisé et des réponses détaillées, je vous invite à contacter directement notre équipe d\'experts.',
      suggestions: ['Contacter un expert', 'Voir la FAQ', 'Prendre rendez-vous']
    }
  };

  const getBotResponse = (userMessage: string): { response: string; suggestions?: string[] } => {
    const message = userMessage.toLowerCase();
    
    // Recherche de mots-clés multiples pour une réponse plus intelligente
    const keywords = Object.keys(intelligentResponses).filter(keyword => 
      keyword !== 'default' && message.includes(keyword)
    );
    
    if (keywords.length > 0) {
      // Prendre la première correspondance trouvée
      return intelligentResponses[keywords[0]];
    }
    
    // Réponses contextuelles avancées
    if (message.includes('merci')) {
      return {
        response: 'Je vous en prie ! 😊 N\'hésitez pas si vous avez d\'autres questions sur nos services immobiliers de prestige.',
        suggestions: ['Voir nos biens', 'Prendre rendez-vous', 'En savoir plus']
      };
    }
    
    if (message.includes('aide') || message.includes('help')) {
      return {
        response: 'Je suis là pour vous aider ! 💡 Je peux vous renseigner sur :\n• Nos biens immobiliers de prestige\n• Nos services d\'accompagnement\n• Le processus d\'investissement\n• La prise de rendez-vous',
        suggestions: ['Voir les biens', 'Nos services', 'Prendre rendez-vous', 'Le processus']
      };
    }
    
    return intelligentResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulation de délai de réponse plus réaliste
    setTimeout(() => {
      const { response, suggestions } = getBotResponse(inputValue);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Ajouter les suggestions si disponibles
      if (suggestions && suggestions.length > 0) {
        const suggestionMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: suggestions.join('|'), // Utiliser | comme séparateur
          sender: 'bot',
          timestamp: new Date(),
          type: 'suggestion'
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, suggestionMessage]);
        }, 500);
      }
      
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Délai variable pour plus de réalisme
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Qu\'est-ce que le Cercle Privé ?',
    'Comment investir avec vous ?',
    'Prendre rendez-vous',
    'Vos biens disponibles',
    'Vendre mon bien',
    'Calculer la rentabilité'
  ];

  // Gérer les notifications non lues
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'bot') {
        setUnreadCount(prev => prev + 1);
      }
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  return (
    <>
      {/* Bouton flottant avec notifications */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        
        {/* Badge de notifications */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
          >
            {unreadCount}
          </motion.div>
        )}
        
        {/* Effet de pulsation */}
        <div className="absolute inset-0 rounded-full bg-yellow-600 animate-ping opacity-20"></div>
      </motion.button>

      {/* Chat window avec animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">Assistant Cercle Privé</h3>
                  <p className="text-xs opacity-90 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    En ligne
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages avec scroll personnalisé */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600'
                      }`}>
                        {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      
                      {/* Message bubble */}
                      <div className={`px-4 py-3 rounded-2xl max-w-full ${
                        message.sender === 'user'
                          ? 'bg-yellow-600 text-white rounded-br-md'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
                      }`}>
                        {message.type === 'suggestion' ? (
                          <div className="space-y-2">
                            <p className="text-sm font-medium mb-3">Suggestions :</p>
                            <div className="space-y-2">
                              {message.text.split('|').map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="block w-full text-left px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors text-sm"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm whitespace-pre-line">{message.text}</p>
                            <p className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Indicateur de frappe amélioré */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Questions rapides pour nouveaux utilisateurs */}
            {messages.length === 1 && (
              <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">Questions fréquentes :</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input avec design amélioré */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {/* Indicateur de statut */}
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Propulsé par IA • Réponse instantanée</span>
                {isTyping && <span className="text-yellow-600">Assistant en train d'écrire...</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
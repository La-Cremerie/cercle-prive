import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bienvenue dans le Cercle Privé ! Je suis votre assistant personnel dédié à l\'immobilier de prestige. Je suis là pour vous accompagner dans vos projets d\'exception et répondre à toutes vos questions sur nos biens off-market. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses: { [key: string]: string } = {
    'bonjour': 'Bonjour ! Bienvenue sur notre site. Je peux vous renseigner sur nos services immobiliers de prestige.',
    'prix': 'Nos biens d\'exception sont proposés dans une gamme de 2 à 15 millions d\'euros. Chaque propriété est unique et sélectionnée pour son potentiel de valorisation patrimoniale.',
    'cercle': 'Le Cercle Privé est notre approche exclusive de l\'immobilier de prestige. Nous vous accompagnons dans la construction d\'un patrimoine solide avec des biens off-market soigneusement sélectionnés.',
    'investir': 'Nous proposons un accompagnement complet : acquisition, travaux, ameublement et revente optimisée. Notre objectif est de transformer votre capital en patrimoine rentable.',
    'rendez-vous': 'Je peux vous aider à prendre rendez-vous avec nos conseillers. Souhaitez-vous que je vous redirige vers notre système de réservation ?',
    'off-market': 'L\'off-market consiste à proposer des biens sans publicité publique. Cela garantit discrétion, exclusivité et valorisation optimale pour nos clients.',
    'biens': 'Nous avons actuellement une sélection de villas, penthouses et propriétés d\'exception sur la Côte d\'Azur. Chaque bien offre un potentiel de rendement attractif.',
    'contact': 'Vous pouvez nous contacter par email à nicolas.c@lacremerie.fr ou utiliser notre formulaire de contact.',
    'services': 'Nous proposons un accompagnement complet : acquisition de biens d\'exception, architecture & design, suivi de chantier, ameublement et optimisation patrimoniale.',
    'localisation': 'Nous intervenons principalement sur la Côte d\'Azur, Monaco, Saint-Tropez, Cannes, et les destinations de prestige.',
    'default': 'Je comprends votre question. Pour un accompagnement personnalisé dans votre projet immobilier, je vous invite à contacter directement notre équipe à nicolas.c@lacremerie.fr'
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(predefinedResponses)) {
      if (keyword !== 'default' && message.includes(keyword)) {
        return response;
      }
    }
    
    return predefinedResponses.default;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulation de délai de réponse
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
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
    'Vos biens disponibles'
  ];

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-yellow-600 text-white rounded-full shadow-lg hover:bg-yellow-700 transition-colors z-40 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-yellow-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div>
                <div>
                  <h3 className="font-medium">Cercle Privé</h3>
                  <p className="text-xs opacity-90">En ligne</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('fr-FR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Questions rapides */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Questions fréquentes :</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(question);
                        handleSendMessage();
                      }}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
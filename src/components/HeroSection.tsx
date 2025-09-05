import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920');
  const [heroContent, setHeroContent] = useState({
    title: "l'excellence immobilière en toute discrétion"
  });

  useEffect(() => {
    // Charger le contenu depuis localStorage
    const loadContent = () => {
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const content = JSON.parse(stored);
        setHeroContent({
          title: content.hero?.title || "l'excellence immobilière en toute discrétion"
        });
        if (content.hero?.backgroundImage) {
          setBackgroundImage(content.hero.backgroundImage);
        }
      }
    };

    loadContent();

    // Charger l'image active depuis localStorage
    const loadActiveImage = () => {
      const stored = localStorage.getItem('presentationImages');
      if (stored) {
        const images = JSON.parse(stored);
        const activeImage = images.find((img: any) => img.isActive);
        if (activeImage) {
          setBackgroundImage(activeImage.url);
        }
      }
    };

    loadActiveImage();

    // Écouter les changements de contenu
    const handleContentChange = (event: CustomEvent) => {
      if (event.detail) {
        setHeroContent({
          title: event.detail.hero?.title || "l'excellence immobilière en toute discrétion"
        });
        if (event.detail.hero?.backgroundImage) {
          setBackgroundImage(event.detail.hero.backgroundImage);
        }
      }
    };

    // Écouter les changements d'image de présentation
    const handleImageChange = (event: CustomEvent) => {
      if (event.detail) {
        setBackgroundImage(event.detail);
      }
    };

    window.addEventListener('contentUpdated', handleContentChange as EventListener);
    window.addEventListener('presentationImageChanged', handleImageChange as EventListener);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentChange as EventListener);
      window.removeEventListener('presentationImageChanged', handleImageChange as EventListener);
    };
  }, []);

  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
        style={{
          backgroundImage: `url(${backgroundImage})`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight"
        >
          {heroContent.title}
        </motion.h1>
        
        <motion.a 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          href="mailto:nicolas.c@lacremerie.fr"
          className="inline-block border border-white text-white px-8 py-3 text-sm font-light tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
        >
          Entrer en relation
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
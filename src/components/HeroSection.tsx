import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState(() => {
    return 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920';
  });
  const [imageLoaded, setImageLoaded] = useState(true); // Commencer avec true pour éviter le flash
  const [heroContent, setHeroContent] = useState(() => {
    return {
      title: "l'excellence immobilière en toute discrétion"
    };
  });

  // Préchargement d'image optimisé anti-FOUC
  useEffect(() => {
    let isMounted = true;
    
    const img = new Image();
    img.onload = () => {
      if (isMounted) setImageLoaded(true);
    };
    img.onerror = () => {
      console.warn('Erreur chargement image hero, fallback activé');
      if (isMounted) {
        // Utiliser une image de fallback
        setBackgroundImage('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200');
        setImageLoaded(true);
      }
    };
    img.src = backgroundImage;

    // Timeout de sécurité pour l'image
    const timeoutId = setTimeout(() => {
      if (isMounted) setImageLoaded(true);
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [backgroundImage]);

  // Charger le contenu personnalisé de manière asynchrone
  useEffect(() => {
    const loadContent = () => {
      try {
        const stored = localStorage.getItem('siteContent');
        if (stored) {
          const content = JSON.parse(stored);
          if (content.hero?.title) {
            setHeroContent({ title: content.hero.title });
          }
          if (content.hero?.backgroundImage) {
            setBackgroundImage(content.hero.backgroundImage);
          }
        }

        const storedImages = localStorage.getItem('presentationImages');
        if (storedImages) {
          const images = JSON.parse(storedImages);
          const activeImage = images.find((img: any) => img.isActive);
          if (activeImage) {
            setBackgroundImage(activeImage.url);
          }
        }
      } catch (error) {
        console.warn('Erreur chargement contenu personnalisé:', error);
      }
    };

    setTimeout(loadContent, 100);

    const handleContentChange = (event: CustomEvent) => {
      if (event.detail?.hero?.title) {
        setHeroContent({ title: event.detail.hero.title });
      }
      if (event.detail?.hero?.backgroundImage) {
        setBackgroundImage(event.detail.hero.backgroundImage);
      }
    };

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

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image avec fallback */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          opacity: imageLoaded ? 1 : 0.8,
          transition: 'opacity 0.8s ease-in-out'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Background de fallback permanent pour éviter le flash */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 -z-10"></div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight"
        >
          {heroContent.title}
        </motion.h1>
        
        <motion.a 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
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
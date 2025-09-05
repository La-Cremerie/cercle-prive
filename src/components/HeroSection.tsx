import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroContent, setHeroContent] = useState(() => {
    return {
      title: "l'excellence immobilière en toute discrétion"
    };
  });

  // Charger l'image admin en priorité
  useEffect(() => {
    const loadAdminImage = () => {
      try {
        // 1. Priorité absolue : image sélectionnée dans l'admin
        const storedImages = localStorage.getItem('presentationImages');
        if (storedImages) {
          const images = JSON.parse(storedImages);
          const activeImage = images.find((img: any) => img.isActive);
          if (activeImage?.url) {
            console.log('Image admin trouvée:', activeImage.url);
            setBackgroundImage(activeImage.url);
            return;
          }
        }
        
        // 2. Fallback : image du contenu du site
        const stored = localStorage.getItem('siteContent');
        if (stored) {
          const content = JSON.parse(stored);
          if (content.hero?.backgroundImage) {
            console.log('Image contenu trouvée:', content.hero.backgroundImage);
            setBackgroundImage(content.hero.backgroundImage);
            return;
          }
        }
        
        // 3. Image par défaut seulement en dernier recours
        console.log('Utilisation image par défaut');
        setBackgroundImage('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920');
        
      } catch (error) {
        console.warn('Erreur chargement image:', error);
        setBackgroundImage('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920');
      }
    };

    loadAdminImage();
  }, []);

  // Chargement d'image optimisé
  useEffect(() => {
    if (!backgroundImage) return;
    
    let isMounted = true;
    
    const img = new Image();
    img.onload = () => {
      if (isMounted) {
        console.log('Image chargée avec succès:', backgroundImage);
        setImageLoaded(true);
      }
    };
    img.onerror = () => {
      if (isMounted) {
        console.warn('Erreur chargement image:', backgroundImage);
        setImageLoaded(true);
      }
    };
    img.src = backgroundImage;

    return () => {
      isMounted = false;
    };
  }, [backgroundImage]);

  // Écouter les changements d'image depuis l'admin
  useEffect(() => {
    const handleContentChange = (event: CustomEvent) => {
      if (event.detail?.hero?.title) {
        setHeroContent({ title: event.detail.hero.title });
      }
    };

    const handleImageChange = (event: CustomEvent) => {
      if (event.detail) {
        setBackgroundImage(event.detail);
        setImageLoaded(false); // Recharger la nouvelle image
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
      {/* Background Image - Uniquement l'image admin sélectionnée */}
      {backgroundImage && imageLoaded && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Fallback pendant le chargement */}
      {(!backgroundImage || !imageLoaded) && (
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      )}

      {/* Loader d'image discret */}
      {backgroundImage && !imageLoaded && (
        <div className="absolute top-4 right-4 z-20">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight"
        >
          {heroContent.title}
        </motion.h1>
        
        <motion.a 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
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
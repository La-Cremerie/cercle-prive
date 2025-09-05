import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
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
    let retryCount = 0;
    const maxRetries = 3;
    
    const loadImageWithRetry = () => {
      const img = new Image();
      
      img.onload = () => {
        if (isMounted) {
          console.log('Image chargée avec succès:', backgroundImage);
          setImageLoaded(true);
          setImageError(false);
        }
      };
      
      img.onerror = () => {
        if (isMounted) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.warn(`Retry ${retryCount}/${maxRetries} pour image:`, backgroundImage);
            setTimeout(loadImageWithRetry, 1000 * retryCount);
          } else {
            console.error('Échec définitif chargement image:', backgroundImage);
            setImageError(true);
            setImageLoaded(true);
          }
        }
      };
      
      // Optimisations de chargement
      img.crossOrigin = 'anonymous';
      img.loading = 'eager';
      img.src = backgroundImage;
    };
    
    loadImageWithRetry();

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
        setImageLoaded(false);
        setImageError(false);
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
      {/* Background Image optimisée avec fallback */}
      {backgroundImage && imageLoaded && !imageError && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            imageRendering: 'crisp-edges',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Fallback optimisé */}
      {(!backgroundImage || !imageLoaded || imageError) && (
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-black"
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
      )}

      {/* Loader d'image optimisé */}
      {backgroundImage && !imageLoaded && !imageError && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white text-xs">Chargement...</span>
          </div>
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
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            willChange: 'transform'
          }}
        >
          {heroContent.title}
        </motion.h1>
        
        <motion.a 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          href="mailto:nicolas.c@lacremerie.fr"
          className="inline-block border border-white text-white px-8 py-3 text-sm font-light tracking-wider hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
          style={{
            willChange: 'transform, background-color'
          }}
        >
          Entrer en relation
        </motion.a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
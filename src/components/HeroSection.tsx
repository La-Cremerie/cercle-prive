import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState(() => {
    // Charger immédiatement l'image depuis l'admin si disponible
    try {
      const storedImages = localStorage.getItem('presentationImages');
      if (storedImages) {
        const images = JSON.parse(storedImages);
        const activeImage = images.find((img: any) => img.isActive);
        if (activeImage) {
          return activeImage.url;
        }
      }
      
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const content = JSON.parse(stored);
        if (content.hero?.backgroundImage) {
          return content.hero.backgroundImage;
        }
      }
    } catch (error) {
      console.warn('Erreur chargement image admin:', error);
    }
    
    // Image par défaut seulement si aucune image admin
    return 'https://i.postimg.cc/dVVFMXmf/Capture-d-e-cran-2025-09-03-a-06-19-50.png';
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroContent, setHeroContent] = useState(() => {
    return {
      title: "l'excellence immobilière en toute discrétion"
    };
  });

  // Chargement d'image optimisé
  useEffect(() => {
    let isMounted = true;
    
    const img = new Image();
    img.onload = () => {
      if (isMounted) setImageLoaded(true);
    };
    img.onerror = () => {
      if (isMounted) {
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
      console.log('🎨 HeroSection: Changement de contenu reçu:', event.detail);
      
      // Mise à jour du titre hero
      if (event.detail?.hero?.title) {
        console.log('📝 Nouveau titre hero:', event.detail.hero.title);
        setHeroContent({ title: event.detail.hero.title });
      }
      
      // Mise à jour de l'image hero
      if (event.detail?.hero?.backgroundImage) {
        console.log('🖼️ Nouvelle image hero détectée:', event.detail.hero.backgroundImage);
        setBackgroundImage(event.detail.hero.backgroundImage);
        setImageLoaded(false);
      }
    };

    const handleImageChange = (event: CustomEvent) => {
      console.log('🖼️ HeroSection: Changement d\'image direct:', event.detail);
      if (event.detail && typeof event.detail === 'string') {
        console.log('🔄 Application immédiate de la nouvelle image:', event.detail);
        setBackgroundImage(event.detail);
        setImageLoaded(false);
      }
    };

    const handleForceUpdate = (event: CustomEvent) => {
      console.log('🔄 HeroSection: Mise à jour forcée:', event.detail);
      if (event.detail?.type === 'content' || event.detail?.type === 'images' || event.detail?.type === 'all') {
        // Recharger le contenu depuis localStorage
        try {
          console.log('📦 Rechargement depuis localStorage...');
          const stored = localStorage.getItem('siteContent');
          if (stored) {
            const content = JSON.parse(stored);
            console.log('📄 Contenu rechargé depuis localStorage:', content);
            
            if (content.hero?.title) {
              console.log('📝 Mise à jour titre depuis localStorage:', content.hero.title);
              setHeroContent({ title: content.hero.title });
            }
            if (content.hero?.backgroundImage) {
              console.log('🖼️ Nouvelle image hero depuis localStorage:', content.hero.backgroundImage);
              setBackgroundImage(content.hero.backgroundImage);
              setImageLoaded(false);
            }
          }
          
          // Vérifier les images de présentation
          const storedImages = localStorage.getItem('presentationImages');
          if (storedImages) {
            const images = JSON.parse(storedImages);
            const activeImage = images.find((img: any) => img.isActive);
            if (activeImage) {
              console.log('🖼️ Image active trouvée:', activeImage.url);
              setBackgroundImage(activeImage.url);
              setImageLoaded(false);
            }
          }
          
          console.log('✅ Rechargement HeroSection terminé');
        } catch (error) {
          console.error('❌ Erreur rechargement contenu HeroSection:', error);
        }
      }
    };

    // Nouvel événement pour forcer le rechargement immédiat
    const handleImmediateUpdate = () => {
      console.log('⚡ HeroSection: Rechargement immédiat déclenché');
      handleForceUpdate({ detail: { type: 'content', source: 'immediate' } } as CustomEvent);
    };
    window.addEventListener('contentUpdated', handleContentChange as EventListener);
    window.addEventListener('presentationImageChanged', handleImageChange as EventListener);
    window.addEventListener('forceUpdate', handleForceUpdate as EventListener);
    window.addEventListener('storage', handleImmediateUpdate);
    window.addEventListener('heroContentUpdate', handleImmediateUpdate);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentChange as EventListener);
      window.removeEventListener('presentationImageChanged', handleImageChange as EventListener);
      window.removeEventListener('forceUpdate', handleForceUpdate as EventListener);
      window.removeEventListener('storage', handleImmediateUpdate);
      window.removeEventListener('heroContentUpdate', handleImmediateUpdate);
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image unique - Priorité à l'image admin */}
      {imageLoaded && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            opacity: 1
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Fallback pendant le chargement */}
      {!imageLoaded && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://i.postimg.cc/dVVFMXmf/Capture-d-e-cran-2025-09-03-a-06-19-50.png)`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
      )}

      {/* Loader d'image discret */}
      {!imageLoaded && (
        <div className="absolute top-4 right-4 z-20">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: imageLoaded ? 0.2 : 0.5 }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: imageLoaded ? 0.4 : 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white mb-8 leading-tight"
        >
          {heroContent.title}
        </motion.h1>
        
        <motion.a 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: imageLoaded ? 0.6 : 0.9 }}
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
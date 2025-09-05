import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [backgroundImage, setBackgroundImage] = useState(() => {
    // Charger immédiatement l'image active depuis localStorage
    try {
      const stored = localStorage.getItem('presentationImages');
      if (stored) {
        const images = JSON.parse(stored);
        const activeImage = images.find((img: any) => img.isActive);
        if (activeImage) {
          return activeImage.url;
        }
      }
      
      // Vérifier aussi dans le contenu du site
      const siteContent = localStorage.getItem('siteContent');
      if (siteContent) {
        const content = JSON.parse(siteContent);
        if (content.hero?.backgroundImage) {
          return content.hero.backgroundImage;
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement de l\'image:', error);
    }
    
    // Image par défaut
    return 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920';
  });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [heroContent, setHeroContent] = useState(() => {
    // Charger immédiatement le contenu depuis localStorage
    try {
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const content = JSON.parse(stored);
        return {
          title: content.hero?.title || "l'excellence immobilière en toute discrétion"
        };
      }
    } catch (error) {
      console.warn('Erreur lors du chargement du contenu:', error);
    }
    
    return {
      title: "l'excellence immobilière en toute discrétion"
    };
  });

  // Précharger l'image immédiatement
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(true);
    };
    img.src = backgroundImage;
  }, [backgroundImage]);
    // Charger le contenu depuis localStorage
    const loadContent = () => {
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const content = JSON.parse(stored);
        setHeroContent({
          title: content.hero?.title || "l'excellence immobilière en toute discrétion"
        });
        if (content.hero?.backgroundImage) {
          const newImage = content.hero.backgroundImage;
          if (newImage !== backgroundImage) {
            setImageLoaded(false); // Reset pour la nouvelle image
            setBackgroundImage(newImage);
          }
        }
      }
    };

    // Charger l'image active depuis localStorage
    const loadActiveImage = () => {
      const stored = localStorage.getItem('presentationImages');
      if (stored) {
        const images = JSON.parse(stored);
        const activeImage = images.find((img: any) => img.isActive);
        if (activeImage && activeImage.url !== backgroundImage) {
          setImageLoaded(false); // Reset pour la nouvelle image
          setBackgroundImage(activeImage.url);
        }
      }
    };

  useEffect(() => {
    // Recharger le contenu et les images si nécessaire
    const loadContent = () => {
      const stored = localStorage.getItem('siteContent');
      if (stored) {
        const content = JSON.parse(stored);
        setHeroContent({
          title: content.hero?.title || "l'excellence immobilière en toute discrétion"
        });
        if (content.hero?.backgroundImage && content.hero.backgroundImage !== backgroundImage) {
          setImageLoaded(false);
          setBackgroundImage(content.hero.backgroundImage);
        }
      }
    };

    const loadActiveImage = () => {
      const stored = localStorage.getItem('presentationImages');
      if (stored) {
        const images = JSON.parse(stored);
        const activeImage = images.find((img: any) => img.isActive);
        if (activeImage && activeImage.url !== backgroundImage) {
          setImageLoaded(false);
          setBackgroundImage(activeImage.url);
        }
      }
    };

    loadContent();
    loadActiveImage();

    // Écouter les changements de contenu
    const handleContentChange = (event: CustomEvent) => {
      if (event.detail) {
        setHeroContent({
          title: event.detail.hero?.title || "l'excellence immobilière en toute discrétion"
        });
        if (event.detail.hero?.backgroundImage) {
          const newImage = event.detail.hero.backgroundImage;
          if (newImage !== backgroundImage) {
            setImageLoaded(false); // Reset pour la nouvelle image
            setBackgroundImage(newImage);
          }
        }
      }
    };

    // Écouter les changements d'image de présentation
    const handleImageChange = (event: CustomEvent) => {
      if (event.detail && event.detail !== backgroundImage) {
        setImageLoaded(false); // Reset pour la nouvelle image
        setBackgroundImage(event.detail);
      }
    };

    window.addEventListener('contentUpdated', handleContentChange as EventListener);
    window.addEventListener('presentationImageChanged', handleImageChange as EventListener);
    
    return () => {
      window.removeEventListener('contentUpdated', handleContentChange as EventListener);
      window.removeEventListener('presentationImageChanged', handleImageChange as EventListener);
    };
  }, [backgroundImage]);

  const { t } = useTranslation();
  
  // Afficher un loader si l'image n'est pas encore chargée
  if (!imageLoaded && !imageError) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-yellow-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-light text-white tracking-wider">CERCLE PRIVÉ</h2>
          <p className="text-gray-400 text-sm mt-2">Chargement de l'image...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageError ? 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920' : backgroundImage})`
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
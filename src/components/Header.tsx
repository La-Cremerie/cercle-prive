@@ .. @@
 import React, { useState } from 'react';
+import { useTranslation } from 'react-i18next';
 import { Menu, X, Phone, Mail } from 'lucide-react';
+import LanguageSelector from './LanguageSelector';
 
 export default function Header() {
 }
+  const { t } = useTranslation();
   const [isMenuOpen, setIsMenuOpen] = useState(false);
 
@@ .. @@
           <div className="flex items-center space-x-8">
             <nav className="hidden md:flex space-x-6">
-              <a href="#accueil" className="text-white hover:text-blue-200 transition-colors">Accueil</a>
-              <a href="#recherche" className="text-white hover:text-blue-200 transition-colors">Recherche</a>
-              <a href="#vendre" className="text-white hover:text-blue-200 transition-colors">Vendre</a>
-              <a href="#contact" className="text-white hover:text-blue-200 transition-colors">Contact</a>
+              <a href="#accueil" className="text-white hover:text-blue-200 transition-colors">{t('nav.accueil')}</a>
+              <a href="#recherche" className="text-white hover:text-blue-200 transition-colors">{t('nav.recherche')}</a>
+              <a href="#vendre" className="text-white hover:text-blue-200 transition-colors">{t('nav.vendre')}</a>
+              <a href="#contact" className="text-white hover:text-blue-200 transition-colors">{t('nav.contact')}</a>
             </nav>
+            <LanguageSelector />
             <button
@@ .. @@
         {isMenuOpen && (
           <div className="md:hidden bg-blue-900/95 backdrop-blur-sm">
             <div className="px-4 py-4 space-y-4">
-              <a href="#accueil" className="block text-white hover:text-blue-200 transition-colors">Accueil</a>
-              <a href="#recherche" className="block text-white hover:text-blue-200 transition-colors">Recherche</a>
-              <a href="#vendre" className="block text-white hover:text-blue-200 transition-colors">Vendre</a>
-              <a href="#contact" className="block text-white hover:text-blue-200 transition-colors">Contact</a>
+              <a href="#accueil" className="block text-white hover:text-blue-200 transition-colors">{t('nav.accueil')}</a>
+              <a href="#recherche" className="block text-white hover:text-blue-200 transition-colors">{t('nav.recherche')}</a>
+              <a href="#vendre" className="block text-white hover:text-blue-200 transition-colors">{t('nav.vendre')}</a>
+              <a href="#contact" className="block text-white hover:text-blue-200 transition-colors">{t('nav.contact')}</a>
+              <div className="pt-4 border-t border-white/20">
+                <LanguageSelector />
+              </div>
             </div>
           </div>
         )}
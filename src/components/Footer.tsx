@@ .. @@
 import React from 'react';
+import { useTranslation } from 'react-i18next';
 import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
 
 export default function Footer() {
 }
+  const { t } = useTranslation();
+
   return (
   )
@@ .. @@
             <div>
               <h3 className="text-xl font-bold text-white mb-4">Prestige Immobilier</h3>
-              <p className="text-blue-100 mb-6 leading-relaxed">
-                Spécialiste de l'immobilier de prestige sur la Côte d'Azur depuis plus de 20 ans.
-              </p>
+              <p className="text-blue-100 mb-6 leading-relaxed">
+                {t('footer.description')}
+              </p>
               <div className="flex space-x-4">
@@ .. @@
             <div>
-              <h4 className="text-lg font-semibold text-white mb-4">Liens rapides</h4>
+              <h4 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
               <ul className="space-y-2">
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Accueil</a></li>
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Recherche</a></li>
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Vendre</a></li>
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Contact</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.accueil')}</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.recherche')}</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.vendre')}</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('nav.contact')}</a></li>
               </ul>
             </div>
 
             <div>
-              <h4 className="text-lg font-semibold text-white mb-4">Informations légales</h4>
+              <h4 className="text-lg font-semibold text-white mb-4">Informations légales</h4>
               <ul className="space-y-2">
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Mentions légales</a></li>
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">Confidentialité</a></li>
-                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">CGU</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('footer.legalNotices')}</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('footer.privacy')}</a></li>
+                <li><a href="#" className="text-blue-100 hover:text-white transition-colors">{t('footer.terms')}</a></li>
               </ul>
             </div>
 
             <div>
-              <h4 className="text-lg font-semibold text-white mb-4">Suivez-nous</h4>
+              <h4 className="text-lg font-semibold text-white mb-4">{t('footer.followUs')}</h4>
               <div className="flex space-x-4">
@@ .. @@
         <div className="border-t border-blue-700 pt-8 text-center">
-          <p className="text-blue-100">© 2024 Prestige Immobilier. Tous droits réservés.</p>
+          <p className="text-blue-100">© 2024 Prestige Immobilier. {t('footer.rights')}</p>
         </div>
       </div>
     </footer>
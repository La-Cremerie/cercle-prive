@@ .. @@
 import React from 'react';
+import { useTranslation } from 'react-i18next';
 import { MapPin, Phone, Mail, Clock } from 'lucide-react';
 
 export default function ContactSection() {
 }
+  const { t } = useTranslation();
+
   return (
   )
@@ .. @@
       <div className="max-w-6xl mx-auto">
         <div className="text-center mb-16">
-          <h2 className="text-4xl font-bold text-white mb-4">Contactez-nous</h2>
-          <p className="text-xl text-blue-100">Notre équipe d'experts est à votre disposition</p>
+          <h2 className="text-4xl font-bold text-white mb-4">{t('contact.title')}</h2>
+          <p className="text-xl text-blue-100">{t('contact.subtitle')}</p>
         </div>
 
@@ .. @@
             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
               <MapPin className="w-8 h-8 text-amber-400 mb-4" />
-              <h3 className="text-xl font-semibold text-white mb-2">Adresse</h3>
-              <p className="text-blue-100">123 Boulevard de la Croisette<br />06400 Cannes</p>
+              <h3 className="text-xl font-semibold text-white mb-2">{t('contact.address').split(',')[0]}</h3>
+              <p className="text-blue-100">{t('contact.address')}</p>
             </div>
 
             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
               <Phone className="w-8 h-8 text-amber-400 mb-4" />
-              <h3 className="text-xl font-semibold text-white mb-2">Téléphone</h3>
-              <p className="text-blue-100">+33 4 93 XX XX XX</p>
+              <h3 className="text-xl font-semibold text-white mb-2">Téléphone</h3>
+              <p className="text-blue-100">{t('contact.phone')}</p>
             </div>
 
             <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
               <Mail className="w-8 h-8 text-amber-400 mb-4" />
-              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
-              <p className="text-blue-100">contact@prestige-immobilier.fr</p>
+              <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
+              <p className="text-blue-100">{t('contact.email')}</p>
             </div>
@@ .. @@
 import React from 'react';
+import { useTranslation } from 'react-i18next';
 import { MapPin, Bed, Bath, Square, Euro } from 'lucide-react';
 
 export default function PropertiesSection() {
 }
+  const { t } = useTranslation();
+
   const properties = [
   ]
@@ .. @@
       <div className="max-w-7xl mx-auto">
         <div className="text-center mb-16">
-          <h2 className="text-4xl font-bold text-gray-800 mb-4">Nos biens d'exception</h2>
-          <p className="text-xl text-gray-600">Une sélection de propriétés uniques sur la Côte d'Azur</p>
+          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('properties.title')}</h2>
+          <p className="text-xl text-gray-600">{t('properties.subtitle')}</p>
         </div>
# CERCLE PRIVÉ - Site Immobilier de Prestige

## 🏗️ Architecture du Projet

Ce projet est conçu avec une **séparation claire** entre la partie publique et l'administration :

### 🌐 **Site Public** (Production)
- **Page d'accueil** avec hero section
- **Section Concept** - Présentation de l'approche off-market
- **Services** - Accompagnement personnalisé
- **Catalogue de biens** - Propriétés de prestige
- **Recherche** - Formulaire de recherche personnalisée
- **Vendre** - Estimation et demande de vente
- **Contact** - Formulaire de contact
- **Chatbot** - Assistant virtuel
- **PWA** - Application web progressive

### 🔐 **Panel d'Administration** (Développement uniquement)
- **Gestion des utilisateurs** - CRUD complet
- **Statistiques** - Graphiques et métriques
- **CRM** - Gestion de la relation client
- **Gestion des biens** - Catalogue immobilier
- **Gestion du contenu** - Modification des textes
- **Personnalisation** - Design et couleurs
- **Emails** - Configuration des templates
- **Analytics** - Analyses avancées

## 🚀 **Déploiement**

### **Site Public** (cercle-prive.luxe)
```bash
npm run build:public
```
- ✅ **Optimisé** pour la production
- ✅ **Léger** - Sans les composants admin
- ✅ **Sécurisé** - Pas d'accès admin en production
- ✅ **Rapide** - Bundle optimisé

### **Version Développement** (Local)
```bash
npm run dev
```
- ✅ **Panel admin** accessible
- ✅ **Outils de développement**
- ✅ **Hot reload**
- ✅ **Debug complet**

## 🔧 **Configuration**

### **Variables d'environnement**
- `VITE_SUPABASE_URL` - URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé publique Supabase

### **Accès Admin** (Développement uniquement)
- **Email** : `nicolas.c@lacremerie.fr`
- **Mot de passe** : `lacremerie2025`

## 📱 **Fonctionnalités**

### **PWA (Progressive Web App)**
- ✅ Installation sur mobile/desktop
- ✅ Fonctionnement hors ligne
- ✅ Notifications push
- ✅ Icônes et manifest

### **Responsive Design**
- ✅ Mobile-first
- ✅ Tablette optimisé
- ✅ Desktop premium

### **Performance**
- ✅ Lazy loading des composants admin
- ✅ Optimisation des images
- ✅ Bundle splitting
- ✅ Service Worker

## 🎨 **Personnalisation**

Le site peut être entièrement personnalisé via le panel admin :
- **Couleurs** et thème
- **Contenu** et textes
- **Images** de présentation
- **Biens immobiliers**
- **Paramètres SEO**

## 🔒 **Sécurité**

- **Séparation** production/développement
- **Authentification** sécurisée
- **Permissions** granulaires
- **Données** chiffrées
- **HTTPS** obligatoire

---

**Développé avec** : React + TypeScript + Tailwind CSS + Supabase + Vite
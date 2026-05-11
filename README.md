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

### **🔄 Synchronisation Collaborative**
Le site est maintenant **entièrement collaboratif** :
- ✅ **Modifications en temps réel** - Tous les utilisateurs voient les changements instantanément
- ✅ **Sauvegarde Supabase** - Toutes les modifications sont persistées en base
- ✅ **Canal temps réel** - WebSocket pour diffusion immédiate
- ✅ **Versioning complet** - Historique de toutes les modifications
- ✅ **Notifications visuelles** - Alertes quand le contenu est mis à jour

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
- **Mot de passe** : `admin123`

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

---

## 🧰 Brique 3 — Générateur de prospection premium (Audit de Valorisation Immobilière)

Module Node.js / TypeScript autonome, **isolé du bundle Vite**, qui transforme
des leads enrichis (sortie de la Brique 2) en messages de prospection prêts à
**révision humaine**. Aucun envoi automatique : la V3 ne fait que **générer,
proposer et exporter**. Toute prise de contact réelle est traitée en V4.

### Installation

```bash
npm install
cp .env.example .env   # remplir si l'on souhaite activer l'IA (optionnel)
```

Aucune clé d'API n'est requise pour faire tourner le mode templates.

### Configuration (`.env`)

```
AI_PROVIDER=openai           # openai | anthropic
ENABLE_AI_OUTREACH=false     # true pour activer l'IA
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
AI_MODEL=                    # ex. gpt-4o-mini, claude-sonnet-4-6
DEFAULT_OUTREACH_TONE=premium_sobre
DEFAULT_HUMAN_REVIEW_REQUIRED=true
```

### Commandes

```bash
npm run outreach          # pipeline complet → CSV + JSON + Markdown
npm run outreach:csv      # export CSV seul depuis data/sample_enriched_leads.csv
npm run outreach:ai       # active l'IA si ENABLE_AI_OUTREACH=true et clé présente
npm run outreach:no-ai    # force les templates sans IA
npm run outreach:md       # exporte uniquement les fiches Markdown par lead
npm run outreach:test     # tests unitaires de la brique 3
npm run all               # lint + outreach (pipeline complet)
```

### Fichiers ajoutés

```
src/types/Outreach.ts
src/outreach/
  generateProspectionMessage.ts
  generateMultiChannelOutreach.ts
  generateOutreachSequence.ts
  generateMessageWithAI.ts
  generateMessageWithoutAI.ts
  outreachPrompts.ts
  outreachTemplates.ts
  outreachCompliance.ts
  outreachToneRules.ts
  outreachGuards.ts
src/crm/prepareOutreachCrmPayload.ts
src/exports/exportOutreachCsv.ts
src/exports/exportOutreachJson.ts
src/exports/exportOutreachMarkdown.ts
scripts/runOutreach.ts
scripts/runOutreachTests.ts
data/sample_enriched_leads.csv
data/sample_outreach_output.csv
exports/outreach/
exports/outreach/markdown/
tsconfig.outreach.json
.env.example
```

### Fonctionnement

1. Lecture du CSV de leads enrichis (Brique 2).
2. Pour chaque lead : évaluation de conformité RGPD, choix du **ton** et du
   **canal recommandé**, génération **multi-canaux** (email court, email
   premium, LinkedIn, script d'appel, formulaire de contact, note CRM) et
   **séquence de relance** de 4 étapes (J0, J+4, J+10, J+21).
3. Application des **garde-fous** (`validateOutreachContent`) qui détectent
   promesses chiffrées, critiques frontales, urgence artificielle, longueur,
   absence de disclaimer RGPD, invention de données.
4. Exports : `exports/outreach/outreach_messages.csv`,
   `outreach_messages.json`, et une fiche Markdown par lead.
5. **Statut par défaut : `pending_human_review`.**

### Limites V3

- Aucun envoi automatique (email, LinkedIn, SMS, formulaire) : volontairement
  hors scope.
- Pas de tracking ouverture / réponse.
- Pas de synchronisation CRM en direct (Airtable / HubSpot / Pipedrive) :
  uniquement un payload CSV / JSON compatible Make / n8n.
- Pas de SMS, ni en V3 ni planifié.
- Les particuliers passent en `manual_review_only` par défaut, sans message
  email pré-généré envoyable.

### Règles RGPD intégrées

- Chaque email B2B inclut automatiquement la mention d'opposition :
  *"Si ce sujet n'est pas pertinent pour vous, indiquez-le-moi simplement et je
  ne vous recontacterai pas."*
- Statuts de conformité (`outreach_allowed_status`) :
  - `allowed_b2b_contextual` — agence / pro avec données publiques B2B.
  - `caution_required` — données B2B partielles ou faible confiance.
  - `manual_review_only` — particulier par défaut.
  - `not_recommended` — priorité D ou conformité insuffisante.
- Tout message porte `human_review_required: true` jusqu'à validation manuelle.

### Validation humaine

Chaque sortie est en statut `pending_human_review`. Le réviseur peut basculer
vers `approved`, `rejected` ou `skipped` (champ `validation_status`) avant
intégration dans la V4. Le champ `reviewer_notes` est libre.

### Exemples

```bash
npm run outreach:test
# 14 passés, 0 échec

npm run outreach
# 6 leads → 4 allowed_b2b_contextual / 1 manual_review_only / 1 not_recommended
# CSV + JSON + 6 fiches Markdown
```

### Principes commerciaux respectés

Les messages générés (templates et IA) sont contraints à :

- ne **jamais** écrire *"votre bien est mal vendu"* ou équivalent ;
- ne **jamais** critiquer l'annonce ou l'agence ;
- ne **jamais** promettre de chiffres (% de marge, garantie de prix) ;
- ne **jamais** créer d'urgence artificielle ;
- ne **jamais** mentionner *IA*, *scraping*, *robot* ;
- privilégier les formulations : *"Nous avons identifié quelques leviers
  possibles…"*, *"Sans remettre en cause le travail déjà réalisé…"*,
  *"L'idée serait de vous transmettre une première lecture rapide…"* ;
- utiliser uniquement les CTA faibles autorisés.

### V4 — Prochaines étapes (documentation uniquement)

La V4 traitera la **prise de contact réelle**, hors du périmètre de la V3 :

- validation humaine via Airtable (file de revue + boutons approve / reject) ;
- envoi via Gmail / Brevo / Lemlist **après** validation explicite ;
- tracking ouverture / réponse ;
- séquences Make / n8n branchées sur le CSV V3 ;
- arrêt automatique des relances dès qu'une réponse arrive ;
- synchronisation HubSpot / Pipedrive ;
- gestion opt-out persistante avec liste de suppression ;
- reporting taux de réponse / rendez-vous / conversion.

/*
  # Système de gestion de contenu collaboratif avec versioning

  1. New Tables
    - `site_content_versions`
      - Stockage versionné de tout le contenu du site
      - Historique complet avec auteur et horodatage
      - Support du rollback et de la comparaison de versions
    
    - `properties_versions`
      - Versioning des biens immobiliers
      - Historique des modifications avec détails
    
    - `presentation_images_versions`
      - Gestion versionnée des images de présentation
      - Catégories : hero, concept
    
    - `design_settings_versions`
      - Historique des paramètres de design
      - Sauvegarde des thèmes et personnalisations
    
    - `content_sync_events`
      - Log des événements de synchronisation
      - Traçabilité complète des modifications

  2. Security
    - RLS activé sur toutes les tables
    - Permissions granulaires par rôle admin
    - Accès public en lecture pour le contenu actif

  3. Features
    - Auto-versioning à chaque modification
    - Synchronisation temps réel via Supabase Realtime
    - Système de rollback complet
    - Gestion des conflits de modification
*/

-- Table principale pour le contenu du site avec versioning
CREATE TABLE IF NOT EXISTS site_content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number integer NOT NULL,
  content_data jsonb NOT NULL,
  is_current boolean DEFAULT false,
  author_id uuid REFERENCES admin_users(id),
  author_name text NOT NULL,
  author_email text NOT NULL,
  change_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(version_number)
);

-- Table pour les biens immobiliers avec versioning
CREATE TABLE IF NOT EXISTS properties_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  version_number integer NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  price text NOT NULL,
  bedrooms integer NOT NULL,
  bathrooms integer NOT NULL,
  surface integer NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  type text NOT NULL CHECK (type IN ('villa', 'appartement', 'penthouse')),
  status text NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'vendu', 'reserve')),
  yield integer,
  is_visible boolean DEFAULT true,
  is_current boolean DEFAULT false,
  author_id uuid REFERENCES admin_users(id),
  author_name text NOT NULL,
  author_email text NOT NULL,
  change_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, version_number)
);

-- Table pour les images de présentation avec versioning
CREATE TABLE IF NOT EXISTS presentation_images_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number integer NOT NULL,
  category text NOT NULL CHECK (category IN ('hero', 'concept')),
  images_data jsonb NOT NULL, -- Array d'objets {id, url, name, type, isActive}
  is_current boolean DEFAULT false,
  author_id uuid REFERENCES admin_users(id),
  author_name text NOT NULL,
  author_email text NOT NULL,
  change_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category, version_number)
);

-- Table pour les paramètres de design avec versioning
CREATE TABLE IF NOT EXISTS design_settings_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number integer NOT NULL,
  settings_data jsonb NOT NULL,
  is_current boolean DEFAULT false,
  author_id uuid REFERENCES admin_users(id),
  author_name text NOT NULL,
  author_email text NOT NULL,
  change_description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(version_number)
);

-- Table pour les événements de synchronisation
CREATE TABLE IF NOT EXISTS content_sync_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('content', 'properties', 'images', 'design')),
  action text NOT NULL CHECK (action IN ('create', 'update', 'delete', 'rollback')),
  target_id text NOT NULL,
  version_number integer,
  author_id uuid REFERENCES admin_users(id),
  author_name text NOT NULL,
  author_email text NOT NULL,
  change_description text,
  event_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE site_content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentation_images_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_settings_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sync_events ENABLE ROW LEVEL SECURITY;

-- Policies pour site_content_versions
CREATE POLICY "Allow public read access to current site content"
  ON site_content_versions
  FOR SELECT
  TO public
  USING (is_current = true);

CREATE POLICY "Allow admin full access to site content versions"
  ON site_content_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor') AND au.is_active = true
    )
  );

-- Policies pour properties_versions
CREATE POLICY "Allow public read access to current visible properties"
  ON properties_versions
  FOR SELECT
  TO public
  USING (is_current = true AND is_visible = true);

CREATE POLICY "Allow admin full access to properties versions"
  ON properties_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor') AND au.is_active = true
    )
  );

-- Policies pour presentation_images_versions
CREATE POLICY "Allow public read access to current presentation images"
  ON presentation_images_versions
  FOR SELECT
  TO public
  USING (is_current = true);

CREATE POLICY "Allow admin full access to presentation images versions"
  ON presentation_images_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor') AND au.is_active = true
    )
  );

-- Policies pour design_settings_versions
CREATE POLICY "Allow public read access to current design settings"
  ON design_settings_versions
  FOR SELECT
  TO public
  USING (is_current = true);

CREATE POLICY "Allow admin full access to design settings versions"
  ON design_settings_versions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor') AND au.is_active = true
    )
  );

-- Policies pour content_sync_events
CREATE POLICY "Allow admin read access to sync events"
  ON content_sync_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role IN ('super_admin', 'admin') AND au.is_active = true
    )
  );

CREATE POLICY "Allow admin insert access to sync events"
  ON content_sync_events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid() AND au.role IN ('super_admin', 'admin', 'editor') AND au.is_active = true
    )
  );

-- Fonctions pour la gestion automatique des versions
CREATE OR REPLACE FUNCTION get_next_version_number(table_name text, category_filter text DEFAULT NULL)
RETURNS integer AS $$
DECLARE
  next_version integer;
BEGIN
  CASE table_name
    WHEN 'site_content_versions' THEN
      SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version FROM site_content_versions;
    WHEN 'properties_versions' THEN
      SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version FROM properties_versions WHERE property_id = category_filter::uuid;
    WHEN 'presentation_images_versions' THEN
      SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version FROM presentation_images_versions WHERE category = category_filter;
    WHEN 'design_settings_versions' THEN
      SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version FROM design_settings_versions;
    ELSE
      next_version := 1;
  END CASE;
  
  RETURN next_version;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer une version comme courante
CREATE OR REPLACE FUNCTION set_current_version(table_name text, version_id uuid, category_filter text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  CASE table_name
    WHEN 'site_content_versions' THEN
      UPDATE site_content_versions SET is_current = false;
      UPDATE site_content_versions SET is_current = true WHERE id = version_id;
    WHEN 'properties_versions' THEN
      UPDATE properties_versions SET is_current = false WHERE property_id = category_filter::uuid;
      UPDATE properties_versions SET is_current = true WHERE id = version_id;
    WHEN 'presentation_images_versions' THEN
      UPDATE presentation_images_versions SET is_current = false WHERE category = category_filter;
      UPDATE presentation_images_versions SET is_current = true WHERE id = version_id;
    WHEN 'design_settings_versions' THEN
      UPDATE design_settings_versions SET is_current = false;
      UPDATE design_settings_versions SET is_current = true WHERE id = version_id;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Insérer le contenu par défaut si aucune version n'existe
DO $$
DECLARE
  default_content jsonb;
  default_images_hero jsonb;
  default_images_concept jsonb;
  default_design jsonb;
BEGIN
  -- Contenu par défaut du site
  default_content := '{
    "hero": {
      "title": "l''excellence immobilière en toute discrétion",
      "subtitle": "",
      "backgroundImage": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920"
    },
    "concept": {
      "title": "CONCEPT",
      "subtitle": "l''immobilier haut gamme en off market",
      "description": [
        "nous avons fait le choix de la discrétion, de l''exclusivité et de l''excellence.",
        "Nous sommes spécialisés dans la vente de biens immobiliers haut de gamme en off-market, une approche confidentielle réservée à une clientèle exigeante, en quête de biens rares, souvent inaccessibles via les canaux traditionnels."
      ],
      "image": "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    "offMarket": {
      "title": "Qu''est-ce que l''Off-Market ?",
      "description": "L''immobilier \"off-market\" consiste à proposer des biens à la vente sans publicité publique ni diffusion sur les plateformes classiques.",
      "sellerAdvantages": ["Discrétion totale", "Moins de visites inutiles", "Rapidité de transaction"],
      "buyerAdvantages": ["Accès à des biens rares", "Moins de concurrence", "Négociation directe"]
    },
    "services": {
      "title": "Nos services",
      "subtitle": "Un accompagnement personnalisé pour tous vos projets immobiliers",
      "items": [
        {"title": "Achat", "description": "Conseil et accompagnement personnalisé"},
        {"title": "Vente", "description": "Estimation et commercialisation"},
        {"title": "Location", "description": "Gestion locative haut de gamme"},
        {"title": "Investissement", "description": "Conseil en investissement immobilier"}
      ]
    },
    "contact": {
      "email": "nicolas.c@lacremerie.fr",
      "phone": "+33 6 52 91 35 56",
      "address": "Côte d''Azur, France"
    },
    "branding": {
      "siteName": "CERCLE PRIVÉ",
      "logoUrl": ""
    }
  }';

  -- Images par défaut pour Hero
  default_images_hero := '[
    {
      "id": "1",
      "url": "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920",
      "name": "Villa moderne avec piscine",
      "type": "url",
      "isActive": true
    }
  ]';

  -- Images par défaut pour Concept
  default_images_concept := '[
    {
      "id": "1",
      "url": "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=800",
      "name": "Architecture moderne méditerranéenne",
      "type": "url",
      "isActive": true
    }
  ]';

  -- Paramètres de design par défaut
  default_design := '{
    "colors": {
      "primary": "#D97706",
      "secondary": "#1F2937",
      "accent": "#F59E0B",
      "background": "#FFFFFF",
      "text": "#111827"
    },
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "headingSize": "large",
      "bodySize": "medium",
      "lineHeight": "relaxed"
    },
    "layout": {
      "containerWidth": "max-w-7xl",
      "sectionSpacing": "py-20",
      "borderRadius": "rounded-lg",
      "shadowIntensity": "shadow-sm"
    },
    "animations": {
      "enabled": true,
      "speed": "normal",
      "intensity": "medium"
    }
  }';

  -- Insérer le contenu par défaut seulement si aucune version n'existe
  IF NOT EXISTS (SELECT 1 FROM site_content_versions) THEN
    INSERT INTO site_content_versions (
      version_number, content_data, is_current, 
      author_name, author_email, change_description
    ) VALUES (
      1, default_content, true,
      'Système', 'system@cercle-prive.fr', 'Version initiale du contenu'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM presentation_images_versions WHERE category = 'hero') THEN
    INSERT INTO presentation_images_versions (
      version_number, category, images_data, is_current,
      author_name, author_email, change_description
    ) VALUES (
      1, 'hero', default_images_hero, true,
      'Système', 'system@cercle-prive.fr', 'Images par défaut Hero'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM presentation_images_versions WHERE category = 'concept') THEN
    INSERT INTO presentation_images_versions (
      version_number, category, images_data, is_current,
      author_name, author_email, change_description
    ) VALUES (
      1, 'concept', default_images_concept, true,
      'Système', 'system@cercle-prive.fr', 'Images par défaut Concept'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM design_settings_versions) THEN
    INSERT INTO design_settings_versions (
      version_number, settings_data, is_current,
      author_name, author_email, change_description
    ) VALUES (
      1, default_design, true,
      'Système', 'system@cercle-prive.fr', 'Paramètres de design par défaut'
    );
  END IF;
END $$;

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_site_content_current ON site_content_versions(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_properties_current ON properties_versions(property_id, is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_images_current ON presentation_images_versions(category, is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_design_current ON design_settings_versions(is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_sync_events_created ON content_sync_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_events_type ON content_sync_events(event_type, created_at DESC);
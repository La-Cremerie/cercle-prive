/*
  # Création de la table des événements de sécurité

  1. Nouvelle Table
    - `security_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type d'événement de sécurité
      - `status` (text) - Statut de l'événement
      - `timestamp` (timestamptz) - Horodatage
      - `session_id` (text) - ID de session anonyme
      - `user_agent_hash` (text) - Hash anonyme du user agent
      - `ip_hash` (text) - Hash anonyme de l'IP
      - `country_code` (text) - Code pays pour géolocalisation générale
      - `details` (jsonb) - Détails techniques anonymisés
      - `created_at` (timestamptz) - Date de création

  2. Sécurité
    - Enable RLS sur la table `security_events`
    - Politique pour les admins seulement
    - Index pour les performances

  3. Conformité RGPD
    - Aucune donnée personnelle stockée
    - Hashes anonymes uniquement
    - Rétention limitée à 90 jours
*/

-- Créer la table des événements de sécurité
CREATE TABLE IF NOT EXISTS security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL CHECK (event_type IN ('login_attempt', 'registration', 'admin_access', 'suspicious_activity', 'form_submission', 'page_access')),
  status text NOT NULL CHECK (status IN ('success', 'failure', 'blocked', 'warning')),
  timestamp timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  user_agent_hash text NOT NULL,
  ip_hash text NOT NULL,
  country_code text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins seulement
CREATE POLICY "Admins can manage security events"
  ON security_events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au
      WHERE au.id = auth.uid()
      AND au.role IN ('super_admin', 'admin')
      AND au.is_active = true
    )
  );

-- Politique pour insertion des événements (service role)
CREATE POLICY "Service role can insert security events"
  ON security_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events (event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_status ON security_events (status, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_session ON security_events (session_id);

-- Fonction pour nettoyer automatiquement les anciens événements (conformité RGPD)
CREATE OR REPLACE FUNCTION cleanup_old_security_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM security_events 
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

-- Programmer le nettoyage automatique (si pg_cron est disponible)
-- SELECT cron.schedule('cleanup-security-events', '0 2 * * *', 'SELECT cleanup_old_security_events();');
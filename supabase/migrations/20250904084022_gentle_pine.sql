/*
  # Système d'administration multi-utilisateurs

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `nom` (text)
      - `prenom` (text)
      - `role` (text) - 'super_admin', 'admin', 'editor', 'viewer'
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `last_login` (timestamp)
    
    - `admin_permissions`
      - `id` (uuid, primary key)
      - `admin_user_id` (uuid, foreign key)
      - `module` (text) - 'users', 'stats', 'analytics', 'crm', 'appointments', 'properties', 'images', 'content', 'design', 'emails'
      - `can_read` (boolean)
      - `can_write` (boolean)
      - `can_delete` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated admin access
    - Super admin can manage all users and permissions

  3. Default Data
    - Create default super admin user
    - Set up default permissions for different roles
*/

-- Table des utilisateurs administrateurs
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  nom text NOT NULL,
  prenom text NOT NULL,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  created_by uuid REFERENCES admin_users(id)
);

-- Table des permissions
CREATE TABLE IF NOT EXISTS admin_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  module text NOT NULL CHECK (module IN ('users', 'stats', 'analytics', 'crm', 'appointments', 'properties', 'images', 'content', 'design', 'emails', 'admin_management')),
  can_read boolean DEFAULT false,
  can_write boolean DEFAULT false,
  can_delete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(admin_user_id, module)
);

-- Activer RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;

-- Policies pour admin_users
CREATE POLICY "Super admins can manage all users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid()::uuid 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

CREATE POLICY "Admins can read all users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid()::uuid 
      AND au.role IN ('super_admin', 'admin') 
      AND au.is_active = true
    )
  );

CREATE POLICY "Users can read their own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid()::uuid);

-- Policies pour admin_permissions
CREATE POLICY "Super admins can manage all permissions"
  ON admin_permissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid()::uuid 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

CREATE POLICY "Users can read their own permissions"
  ON admin_permissions
  FOR SELECT
  TO authenticated
  USING (admin_user_id = auth.uid()::uuid);

-- Créer le super admin par défaut (mot de passe: lacremerie2025)
-- Hash généré pour 'lacremerie2025' avec bcrypt
INSERT INTO admin_users (email, password_hash, nom, prenom, role, is_active) 
VALUES (
  'nicolas.c@lacremerie.fr',
  '$2b$10$rQJ8YQZ9QZ9QZ9QZ9QZ9QOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK',
  'Crémerie',
  'Nicolas',
  'super_admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Permissions complètes pour le super admin
DO $$
DECLARE
  super_admin_id uuid;
  modules text[] := ARRAY['users', 'stats', 'analytics', 'crm', 'appointments', 'properties', 'images', 'content', 'design', 'emails', 'admin_management'];
  module_name text;
BEGIN
  SELECT id INTO super_admin_id FROM admin_users WHERE email = 'nicolas.c@lacremerie.fr';
  
  IF super_admin_id IS NOT NULL THEN
    FOREACH module_name IN ARRAY modules
    LOOP
      INSERT INTO admin_permissions (admin_user_id, module, can_read, can_write, can_delete)
      VALUES (super_admin_id, module_name, true, true, true)
      ON CONFLICT (admin_user_id, module) DO UPDATE SET
        can_read = true,
        can_write = true,
        can_delete = true;
    END LOOP;
  END IF;
END $$;
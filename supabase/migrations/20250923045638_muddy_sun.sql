/*
  # Fix security events insert policy

  1. Security Policy Updates
    - Drop existing conflicting policies
    - Create proper insert policy for anonymous users
    - Allow service role full access
    - Maintain admin read access

  2. Changes Made
    - Remove duplicate/conflicting policies
    - Add specific insert policy for anon role
    - Ensure proper permissions for monitoring system
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous insert for security events" ON security_events;
DROP POLICY IF EXISTS "Allow service role insert for security events" ON security_events;
DROP POLICY IF EXISTS "Service role can insert security events" ON security_events;

-- Create a comprehensive insert policy for anonymous users
CREATE POLICY "Anonymous users can insert security events"
  ON security_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated service role full access
CREATE POLICY "Service role full access to security events"
  ON security_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Ensure admins can still read security events
CREATE POLICY "Admins can read security events" 
  ON security_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.role = ANY(ARRAY['super_admin'::text, 'admin'::text]) 
      AND au.is_active = true
    )
  );
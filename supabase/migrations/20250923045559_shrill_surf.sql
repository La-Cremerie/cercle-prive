/*
  # Fix RLS policy for security_events table

  1. Security Updates
    - Add policy to allow anonymous users to insert security events
    - This is necessary for privacy-compliant monitoring from the frontend
    - Only INSERT operations are allowed for anonymous users
    - Admin users retain full access for reading events

  2. Changes Made
    - Add policy "Allow anonymous insert for security events"
    - Maintains existing admin access policies
    - Ensures frontend can log security events without authentication
*/

-- Allow anonymous users to insert security events (for privacy monitoring)
CREATE POLICY "Allow anonymous insert for security events"
  ON security_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure service role can also insert (for backend operations)
CREATE POLICY "Allow service role insert for security events"
  ON security_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);
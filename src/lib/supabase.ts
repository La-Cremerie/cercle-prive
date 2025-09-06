import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('Supabase configuration check:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: supabaseUrl !== 'https://your-project.supabase.co',
  keyValid: supabaseAnonKey !== 'your-anon-key'
});

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('Supabase not configured - using mock data');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // Disable auth persistence since we're using custom login
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'cercle-prive-web'
    }
  }
});

// Initialiser la synchronisation temps réel
export const initializeRealtime = () => {
  console.log('🚀 Initialisation de la synchronisation temps réel...');
  
  // Vérifier que Supabase est configuré
  if (supabaseUrl === 'https://your-project.supabase.co' || !supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
    console.warn('⚠️ Supabase non configuré - synchronisation temps réel désactivée');
    return false;
  }
  
  console.log('✅ Supabase configuré - synchronisation temps réel disponible');
  return true;
};
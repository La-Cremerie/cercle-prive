import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🔧 Configuration Supabase:', {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: supabaseUrl !== 'https://your-project.supabase.co',
  keyValid: supabaseAnonKey !== 'your-anon-key',
  url: supabaseUrl.substring(0, 30) + '...',
  keyLength: supabaseAnonKey.length
});

// Vérifier la configuration
const isConfigured = supabaseUrl !== 'https://your-project.supabase.co' && 
                    supabaseAnonKey !== 'your-anon-key' &&
                    supabaseUrl.startsWith('https://') &&
                    supabaseAnonKey.length > 20;

if (!isConfigured) {
  console.error('❌ SUPABASE NON CONFIGURÉ - Fonctionnalités limitées');
  console.log('📋 Pour configurer Supabase :');
  console.log('1. Cliquez sur "Connect to Supabase" en haut à droite');
  console.log('2. Ou ajoutez vos variables d\'environnement manuellement');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Enable auth persistence for admin sessions
    autoRefreshToken: true,
    detectSessionInUrl: false
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

// Test de connexion Supabase
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!isConfigured) {
    console.warn('⚠️ Supabase non configuré - test impossible');
    return false;
  }

  try {
    // Test avec timeout pour éviter les blocages
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const { data, error } = await supabase.from('user_registrations').select('count').limit(1);
    
    clearTimeout(timeoutId);
    
    if (error) {
      console.error('❌ Erreur connexion Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⚠️ Timeout connexion Supabase (>5s)');
    } else if (error.message?.includes('Failed to fetch')) {
      console.warn('⚠️ Pas de connexion internet ou Supabase inaccessible');
    } else {
      console.error('❌ Test connexion Supabase échoué:', error);
    }
    return false;
  }
};

// Initialiser la synchronisation temps réel
export const initializeRealtime = async (): Promise<boolean> => {
  console.log('🚀 Initialisation de la synchronisation temps réel...');
  
  if (!isConfigured) {
    console.warn('⚠️ Supabase non configuré - synchronisation temps réel désactivée');
    return false;
  }
  
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest) {
    console.error('❌ Impossible d\'initialiser la synchronisation - connexion échouée');
    return false;
  }
  
  console.log('✅ Supabase configuré et connecté - synchronisation temps réel disponible');
  return true;
};

export { isConfigured as isSupabaseConfigured };
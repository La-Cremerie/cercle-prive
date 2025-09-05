import { supabase } from '../lib/supabase';
import type { NewUserRegistration, UserRegistration } from '../types/database';

// Vérifier si Supabase est configuré
const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && 
         url !== 'https://your-project.supabase.co' && 
         key !== 'your-anon-key' &&
         url.startsWith('https://') &&
         key.length > 20;
};

// Stockage local comme fallback
const getLocalUsers = (): UserRegistration[] => {
  try {
    const stored = localStorage.getItem('localUsers');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users: UserRegistration[]) => {
  try {
    localStorage.setItem('localUsers', JSON.stringify(users));
  } catch (error) {
    console.warn('Erreur sauvegarde locale:', error);
  }
};

export class UserService {
  static async registerUser(userData: Omit<NewUserRegistration, 'id' | 'created_at'>): Promise<UserRegistration> {
    console.log('UserService.registerUser called with:', { email: userData.email });
    
    // Si Supabase n'est pas configuré, utiliser le stockage local
    if (!isSupabaseConfigured()) {
      console.log('Using local storage fallback for user registration');
      const users = getLocalUsers();
      
      // Vérifier si l'email existe déjà
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Cette adresse email est déjà utilisée');
      }
      
      const newUser: UserRegistration = {
        id: Date.now().toString(),
        ...userData,
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      saveLocalUsers(users);
      return newUser;
    }

    console.log('Attempting Supabase registration');
    try {
      const { data, error } = await supabase
        .from('user_registrations')
        .insert([userData])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Cette adresse email est déjà utilisée');
        }
        throw new Error(`Erreur lors de l'inscription: ${error.message}`);
      }

      console.log('Supabase registration successful:', data);
      return data;
    } catch (error) {
      // Fallback vers le stockage local en cas d'erreur réseau
      console.warn('Supabase error, falling back to local storage:', error);
      
      // Éviter la récursion infinie
      const users = getLocalUsers();
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Cette adresse email est déjà utilisée');
      }
      
      const newUser: UserRegistration = {
        id: Date.now().toString(),
        ...userData,
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      saveLocalUsers(users);
      return newUser;
    }
  }

  static async getUserByEmail(email: string): Promise<UserRegistration | null> {
    console.log('UserService.getUserByEmail called with:', email);
    
    // Si Supabase n'est pas configuré, utiliser le stockage local
    if (!isSupabaseConfigured()) {
      console.log('Using local storage for user lookup');
      const users = getLocalUsers();
      return users.find(u => u.email === email) || null;
    }

    console.log('Attempting Supabase user lookup');
    try {
      const { data, error } = await supabase
        .from('user_registrations')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Erreur lors de la recherche: ${error.message}`);
      }

      console.log('Supabase lookup result:', data);
      return data;
    } catch (error) {
      // Fallback vers le stockage local
      console.warn('Supabase lookup error, using local storage:', error);
      const users = getLocalUsers();
      return users.find(u => u.email === email) || null;
    }
  }

  static async getAllUsers(): Promise<UserRegistration[]> {
    // Si Supabase n'est pas configuré, utiliser le stockage local
    if (!isSupabaseConfigured()) {
      return getLocalUsers();
    }

    try {
      const { data, error } = await supabase
        .from('user_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      // Fallback vers le stockage local
      console.warn('Erreur Supabase, utilisation du stockage local:', error);
      return getLocalUsers();
    }
  }

  static async updateUser(userId: string, userData: Partial<UserRegistration>): Promise<UserRegistration> {
    // Si Supabase n'est pas configuré, utiliser le stockage local
    if (!isSupabaseConfigured()) {
      const users = getLocalUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('Utilisateur non trouvé');
      }
      
      // Vérifier l'unicité de l'email si modifié
      if (userData.email && userData.email !== users[userIndex].email) {
        const emailExists = users.some(u => u.email === userData.email && u.id !== userId);
        if (emailExists) {
          throw new Error('Cette adresse email est déjà utilisée');
        }
      }
      
      users[userIndex] = { ...users[userIndex], ...userData };
      saveLocalUsers(users);
      return users[userIndex];
    }

    try {
      const { data, error } = await supabase
        .from('user_registrations')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Cette adresse email est déjà utilisée');
        }
        throw new Error(`Erreur lors de la modification: ${error.message}`);
      }

      return data;
    } catch (error) {
      // Fallback vers le stockage local
      console.warn('Erreur Supabase, utilisation du stockage local:', error);
      return this.updateUser(userId, userData);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    // Si Supabase n'est pas configuré, utiliser le stockage local
    if (!isSupabaseConfigured()) {
      const users = getLocalUsers();
      const filteredUsers = users.filter(u => u.id !== userId);
      saveLocalUsers(filteredUsers);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_registrations')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
    } catch (error) {
      // Fallback vers le stockage local
      console.warn('Erreur Supabase, utilisation du stockage local:', error);
      const users = getLocalUsers();
      const filteredUsers = users.filter(u => u.id !== userId);
      saveLocalUsers(filteredUsers);
    }
  }

  static async createUser(userData: Omit<UserRegistration, 'id' | 'created_at'>): Promise<UserRegistration> {
    // Utiliser la même logique que registerUser
    return this.registerUser(userData);
  }
}
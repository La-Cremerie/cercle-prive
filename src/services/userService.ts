import { supabase } from '../lib/supabase';
import type { NewUserRegistration, UserRegistration } from '../types/database';

export class UserService {
  static async registerUser(userData: Omit<NewUserRegistration, 'id' | 'created_at'>): Promise<UserRegistration> {
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

    return data;
  }

  static async getUserByEmail(email: string): Promise<UserRegistration | null> {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Erreur lors de la recherche: ${error.message}`);
    }

    return data;
  }

  static async getAllUsers(): Promise<UserRegistration[]> {
    const { data, error } = await supabase
      .from('user_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }

    return data || [];
  }

  static async updateUser(userId: string, userData: Partial<UserRegistration>): Promise<UserRegistration> {
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
  }

  static async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_registrations')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }

  static async createUser(userData: Omit<UserRegistration, 'id' | 'created_at'>): Promise<UserRegistration> {
    const { data, error } = await supabase
      .from('user_registrations')
      .insert([userData])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Cette adresse email est déjà utilisée');
      }
      throw new Error(`Erreur lors de la création: ${error.message}`);
    }

    return data;
  }
}
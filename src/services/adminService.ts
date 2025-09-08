import { supabase } from '../lib/supabase';
import type { AdminUser, AdminPermission, AdminModule } from '../types/admin';
import { AdminEmailService } from './adminEmailService';
import bcrypt from 'bcryptjs';

export class AdminService {
  // Authentification admin
  static async loginAdmin(email: string, password: string): Promise<AdminUser> {
    try {
      console.log('🔐 Tentative de connexion admin:', email);
      
      // 1. Vérifier d'abord avec les comptes de développement
      const DEV_ACCOUNTS = {
        'nicolas.c@lacremerie.fr': 'lacremerie2025',
        'quentin@lacremerie.fr': '123'
      };

      const devPassword = DEV_ACCOUNTS[email as keyof typeof DEV_ACCOUNTS];
      
      if (devPassword && password === devPassword) {
        console.log('✅ Connexion avec compte de développement');
        
        // Créer un utilisateur admin temporaire pour le développement
        const devAdmin: AdminUser = {
          id: `dev-${email.split('@')[0]}`,
          email,
          password_hash: await bcrypt.hash(password, 10),
          nom: email === 'nicolas.c@lacremerie.fr' ? 'Crémerie' : 'Lacremerie',
          prenom: email === 'nicolas.c@lacremerie.fr' ? 'Nicolas' : 'Quentin',
          role: 'super_admin',
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          created_by: null
        };

        // Établir une session Supabase pour l'authentification
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (!authError && authData.user) {
            console.log('✅ Session Supabase établie');
          } else {
            console.warn('⚠️ Session Supabase non établie, mode local uniquement');
          }
        } catch (authError) {
          console.warn('⚠️ Erreur session Supabase:', authError);
        }

        // Stocker les informations admin
        localStorage.setItem('currentAdminId', devAdmin.id);
        localStorage.setItem('currentAdminEmail', devAdmin.email);
        localStorage.setItem('currentAdminName', `${devAdmin.prenom} ${devAdmin.nom}`);
        localStorage.setItem('currentAdminRole', devAdmin.role);
        localStorage.setItem('supabaseAuthEstablished', 'true');

        return devAdmin;
      }

      // 2. Authentification Supabase normale
      try {
        console.log('🔐 Tentative d\'authentification Supabase...');
        
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError || !authData.user) {
          throw new Error('Email ou mot de passe incorrect');
        }

        console.log('✅ Authentification Supabase réussie');

        // Récupérer l'utilisateur admin depuis la base
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .eq('is_active', true)
          .single();

        if (error || !adminUser) {
          throw new Error('Utilisateur admin non trouvé ou inactif');
        }

        // Mettre à jour la dernière connexion
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', adminUser.id);

        // Stocker les informations admin
        localStorage.setItem('currentAdminId', adminUser.id);
        localStorage.setItem('currentAdminEmail', adminUser.email);
        localStorage.setItem('currentAdminName', `${adminUser.prenom} ${adminUser.nom}`);
        localStorage.setItem('currentAdminRole', adminUser.role);
        localStorage.setItem('supabaseAuthEstablished', 'true');

        return adminUser;

      } catch (supabaseError) {
        console.error('❌ Erreur authentification Supabase:', supabaseError);
        throw new Error('Email ou mot de passe incorrect');
      }
      
    } catch (error: any) {
      console.error('❌ Erreur authentification admin:', error);
      throw error;
    }
  }

  // Récupérer les permissions d'un admin
  static async getAdminPermissions(adminUserId: string): Promise<AdminPermission[]> {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('admin_user_id', adminUserId);

    if (error) {
      throw new Error(`Erreur lors de la récupération des permissions: ${error.message}`);
    }

    return data || [];
  }

  // Vérifier si un admin a une permission spécifique
  static async hasPermission(
    adminUserId: string, 
    module: AdminModule, 
    action: 'read' | 'write' | 'delete'
  ): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_permissions')
      .select(`can_${action}`)
      .eq('admin_user_id', adminUserId)
      .eq('module', module)
      .single();

    if (error) {
      return false;
    }

    return data?.[`can_${action}`] || false;
  }

  // Récupérer tous les admins (super admin seulement)
  static async getAllAdmins(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Erreur lors de la récupération: ${error.message}`);
    }

    return data || [];
  }

  // Créer un nouvel admin
  static async createAdmin(adminData: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    role: AdminUser['role'];
    permissions: Partial<Record<AdminModule, { read: boolean; write: boolean; delete: boolean }>>;
    createdBy: string;
  }): Promise<AdminUser> {
    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // Créer l'utilisateur admin
    const { data: newAdmin, error: userError } = await supabase
      .from('admin_users')
      .insert([{
        email: adminData.email,
        password_hash: passwordHash,
        nom: adminData.nom,
        prenom: adminData.prenom,
        role: adminData.role,
        created_by: adminData.createdBy,
        is_active: false // Inactif jusqu'à validation
      }])
      .select()
      .single();

    if (userError) {
      if (userError.code === '23505') {
        throw new Error('Cette adresse email est déjà utilisée');
      }
      throw new Error(`Erreur lors de la création: ${userError.message}`);
    }

    // Créer les permissions
    const permissionInserts = Object.entries(adminData.permissions).map(([module, perms]) => ({
      admin_user_id: newAdmin.id,
      module: module as AdminModule,
      can_read: perms.read,
      can_write: perms.write,
      can_delete: perms.delete
    }));

    if (permissionInserts.length > 0) {
      const { error: permError } = await supabase
        .from('admin_permissions')
        .insert(permissionInserts);

      if (permError) {
        // Supprimer l'utilisateur créé en cas d'erreur
        await supabase.from('admin_users').delete().eq('id', newAdmin.id);
        throw new Error(`Erreur lors de la création des permissions: ${permError.message}`);
      }
    }

    // Envoyer l'email de validation à quentin@lacremerie.fr
    try {
      await AdminEmailService.sendAdminValidationRequest(newAdmin, adminData.createdBy);
    } catch (emailError) {
      console.warn('Erreur lors de l\'envoi de l\'email de validation:', emailError);
      // Ne pas faire échouer la création pour une erreur d'email
    }
    // Envoyer l'email de validation à quentin@lacremerie.fr
    try {
      await AdminEmailService.sendAdminValidationRequest(newAdmin, adminData.createdBy);
    } catch (emailError) {
      console.warn('Erreur lors de l\'envoi de l\'email de validation:', emailError);
      // Ne pas faire échouer la création pour une erreur d'email
    }
    return newAdmin;
  }

  // Valider un administrateur
  static async validateAdmin(adminId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: true })
      .eq('id', adminId);

    if (error) {
      throw new Error(`Erreur lors de la validation: ${error.message}`);
    }
  }

  // Rejeter un administrateur
  static async rejectAdmin(adminId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (error) {
      throw new Error(`Erreur lors du rejet: ${error.message}`);
    }
  }
  // Valider un administrateur
  static async validateAdmin(adminId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: true })
      .eq('id', adminId);

    if (error) {
      throw new Error(`Erreur lors de la validation: ${error.message}`);
    }
  }

  // Rejeter un administrateur
  static async rejectAdmin(adminId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminId);

    if (error) {
      throw new Error(`Erreur lors du rejet: ${error.message}`);
    }
  }
  // Mettre à jour les permissions d'un admin
  static async updateAdminPermissions(
    adminUserId: string,
    permissions: Partial<Record<AdminModule, { read: boolean; write: boolean; delete: boolean }>>
  ): Promise<void> {
    // Supprimer les anciennes permissions
    await supabase
      .from('admin_permissions')
      .delete()
      .eq('admin_user_id', adminUserId);

    // Créer les nouvelles permissions
    const permissionInserts = Object.entries(permissions).map(([module, perms]) => ({
      admin_user_id: adminUserId,
      module: module as AdminModule,
      can_read: perms.read,
      can_write: perms.write,
      can_delete: perms.delete
    }));

    if (permissionInserts.length > 0) {
      const { error } = await supabase
        .from('admin_permissions')
        .insert(permissionInserts);

      if (error) {
        throw new Error(`Erreur lors de la mise à jour des permissions: ${error.message}`);
      }
    }
  }

  // Désactiver un admin
  static async deactivateAdmin(adminUserId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: false })
      .eq('id', adminUserId);

    if (error) {
      throw new Error(`Erreur lors de la désactivation: ${error.message}`);
    }
  }

  // Réactiver un admin
  static async activateAdmin(adminUserId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .update({ is_active: true })
      .eq('id', adminUserId);

    if (error) {
      throw new Error(`Erreur lors de la réactivation: ${error.message}`);
    }
  }

  // Supprimer un admin
  static async deleteAdmin(adminUserId: string): Promise<void> {
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminUserId);

    if (error) {
      throw new Error(`Erreur lors de la suppression: ${error.message}`);
    }
  }
}
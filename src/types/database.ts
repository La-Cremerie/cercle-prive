export interface Database {
  public: {
    Tables: {
      user_registrations: {
        Row: {
          id: string;
          nom: string;
          prenom: string;
          telephone: string;
          email: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          nom: string;
          prenom: string;
          telephone: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          prenom?: string;
          telephone?: string;
          email?: string;
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          nom: string;
          prenom: string;
          role: 'super_admin' | 'admin' | 'editor' | 'viewer';
          is_active: boolean;
          created_at: string;
          last_login: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          nom: string;
          prenom: string;
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer';
          is_active?: boolean;
          created_at?: string;
          last_login?: string;
          created_by?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          nom?: string;
          prenom?: string;
          role?: 'super_admin' | 'admin' | 'editor' | 'viewer';
          is_active?: boolean;
          created_at?: string;
          last_login?: string;
          created_by?: string;
        };
      };
      admin_permissions: {
        Row: {
          id: string;
          admin_user_id: string;
          module: string;
          can_read: boolean;
          can_write: boolean;
          can_delete: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_user_id: string;
          module: string;
          can_read?: boolean;
          can_write?: boolean;
          can_delete?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_user_id?: string;
          module?: string;
          can_read?: boolean;
          can_write?: boolean;
          can_delete?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type UserRegistration = Database['public']['Tables']['user_registrations']['Row'];
export type NewUserRegistration = Database['public']['Tables']['user_registrations']['Insert'];
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Écouter les nouvelles inscriptions en temps réel
    const channel = supabase
      .channel('user_registrations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_registrations'
        },
        (payload) => {
          const newUser = payload.new as any;
          setUnreadCount(prev => prev + 1);
          
          // Notification toast pour l'admin
          if (localStorage.getItem('adminLoggedIn') === 'true') {
            toast.success(
              `Nouvelle inscription : ${newUser.prenom} ${newUser.nom}`,
              {
                duration: 5000,
                icon: '🎉'
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return { unreadCount, markAsRead };
};
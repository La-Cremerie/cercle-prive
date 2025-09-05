import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react()
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-hot-toast'],
    exclude: []
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false, // Désactiver les sourcemaps en production pour réduire la taille
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : []
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
          utils: ['date-fns', 'react-hot-toast'],
          supabase: ['@supabase/supabase-js']
        }
      },
      external: []
    },
    // Optimisations pour éviter les erreurs de chargement
    assetsInlineLimit: 4096, // Inline les petits assets
    chunkSizeWarningLimit: 1000 // Augmenter la limite pour éviter les warnings
  },
  // Configuration pour éviter les erreurs de réseau
  preview: {
    port: 4173,
    strictPort: true,
    host: true
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      overlay: false,
      port: 24678
    }
  }
}));

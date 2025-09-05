import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react()
  ],
  // Configuration robuste pour éviter les erreurs de parsing
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'empty-import-meta': 'silent'
    },
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-hot-toast'],
    exclude: ['@vite/client', '@vite/env'],
    force: true
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: false,
    // Configuration robuste pour éviter les erreurs de build
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer les warnings non-critiques
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        if (warning.code === 'EVAL') return;
        warn(warning);
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    https: false // Éviter les problèmes de certificat en preview
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      overlay: false, // Éviter les overlays bloquants
      port: 24678
    },
    https: false, // Éviter les problèmes de certificat en dev
    cors: true
  },
  // Variables d'environnement sécurisées
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis' // Polyfill pour certains environnements
  }
}));
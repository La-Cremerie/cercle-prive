import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  root: '.',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pexels-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          }
        ]
      },
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'CERCLE PRIVÉ - Immobilier de Prestige',
        short_name: 'CERCLE PRIVÉ',
        description: 'L\'excellence immobilière en toute discrétion',
        theme_color: '#D97706',
        background_color: '#1F2937',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
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
    minify: 'terser',
    sourcemap: true, // Activer les sourcemaps pour le debug
    // Configuration robuste pour éviter les erreurs de build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['framer-motion', 'lucide-react']
        }
      },
      onwarn(warning, warn) {
        // Ignorer les warnings non-critiques
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        if (warning.code === 'EVAL') return;
        warn(warning);
      }
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.warn'] : [],
        // Éviter les optimisations trop agressives qui peuvent causer des erreurs
        unsafe: false,
        unsafe_comps: false
      },
      mangle: {
        safari10: true // Compatibilité Safari
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
    host: '0.0.0.0',
    hmr: {
      overlay: false,
      port: 24678,
      host: 'localhost'
    },
    https: false,
    cors: true,
    proxy: {},
    fs: {
      strict: false
    }
  },
  // Variables d'environnement sécurisées
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis' // Polyfill pour certains environnements
  }
}));
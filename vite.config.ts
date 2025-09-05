import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
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
      }
    })
  ],
  // Configuration robuste pour éviter les erreurs de parsing
  esbuild: {
    logOverride: { 
      'this-is-undefined-in-esm': 'silent',
      'empty-import-meta': 'silent'
    },
    target: 'es2020',
    minify: true,
    treeShaking: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-hot-toast'],
    exclude: ['@vite/client', '@vite/env'],
    force: true
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: mode === 'development',
    cssMinify: true,
    reportCompressedSize: false,
    // Configuration robuste pour éviter les erreurs de build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts']
        }
      },
      onwarn(warning, warn) {
        // Ignorer les warnings non-critiques
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        if (warning.code === 'EVAL') return;
        warn(warning);
      }
    },
    assetsInlineLimit: 8192,
    chunkSizeWarningLimit: 2000
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    https: false,
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      overlay: false, // Éviter les overlays bloquants
      port: 24678
    },
    https: false,
    cors: true
  },
  // Variables d'environnement sécurisées
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'globalThis' // Polyfill pour certains environnements
  }
}));
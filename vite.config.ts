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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
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
      includeAssets: ['favicon.ico', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'OFF MARKET - Immobilier de Prestige',
        short_name: 'OFF MARKET',
        description: 'L\'excellence immobilière en toute discrétion',
        theme_color: '#D97706',
        background_color: '#1F2937',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      external: mode === 'production' ? [
        // Exclure les composants admin en production
        './src/components/AdminLogin',
        './src/components/AdminPanel',
        './src/components/AdminUserManagement',
        './src/components/CRMSystem',
        './src/components/StatsCharts',
        './src/components/AdvancedAnalytics',
        './src/components/EmailSettings',
        './src/components/PropertyManagement',
        './src/components/PresentationImageManager',
        './src/components/ContentManager',
        './src/components/DesignCustomizer',
        './src/components/AppointmentBooking',
        './src/components/LeadScoring',
        './src/components/SEOManager',
        './src/components/PerformanceOptimizer'
      ] : []
    }
  }
}));

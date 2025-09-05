// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // 5MB limit
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "pexels-images",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30
                // 30 jours
              }
            }
          }
        ]
      },
      includeAssets: ["favicon.ico", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "OFF MARKET - Immobilier de Prestige",
        short_name: "OFF MARKET",
        description: "L'excellence immobili\xE8re en toute discr\xE9tion",
        theme_color: "#D97706",
        background_color: "#1F2937",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  build: {
    rollupOptions: {
      external: mode === "production" ? [
        // Exclure les composants admin en production
        "./src/components/AdminLogin",
        "./src/components/AdminPanel",
        "./src/components/AdminUserManagement",
        "./src/components/CRMSystem",
        "./src/components/StatsCharts",
        "./src/components/AdvancedAnalytics",
        "./src/components/EmailSettings",
        "./src/components/PropertyManagement",
        "./src/components/PresentationImageManager",
        "./src/components/ContentManager",
        "./src/components/DesignCustomizer",
        "./src/components/AppointmentBooking",
        "./src/components/LeadScoring",
        "./src/components/SEOManager",
        "./src/components/PerformanceOptimizer"
      ] : []
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmMn0nXSxcbiAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDUgKiAxMDI0ICogMTAyNCwgLy8gNU1CIGxpbWl0XG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdXJsUGF0dGVybjogL15odHRwczpcXC9cXC9pbWFnZXNcXC5wZXhlbHNcXC5jb21cXC8uKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogJ0NhY2hlRmlyc3QnLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6ICdwZXhlbHMtaW1hZ2VzJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjoge1xuICAgICAgICAgICAgICAgIG1heEVudHJpZXM6IDUwLFxuICAgICAgICAgICAgICAgIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDMwIC8vIDMwIGpvdXJzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uaWNvJywgJ2ljb24tMTkyLnBuZycsICdpY29uLTUxMi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdPRkYgTUFSS0VUIC0gSW1tb2JpbGllciBkZSBQcmVzdGlnZScsXG4gICAgICAgIHNob3J0X25hbWU6ICdPRkYgTUFSS0VUJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdMXFwnZXhjZWxsZW5jZSBpbW1vYmlsaVx1MDBFOHJlIGVuIHRvdXRlIGRpc2NyXHUwMEU5dGlvbicsXG4gICAgICAgIHRoZW1lX2NvbG9yOiAnI0Q5NzcwNicsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6ICcjMUYyOTM3JyxcbiAgICAgICAgZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuICAgICAgICBzY29wZTogJy8nLFxuICAgICAgICBzdGFydF91cmw6ICcvJyxcbiAgICAgICAgaWNvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdpY29uLTE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICdpY29uLTUxMi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICc1MTJ4NTEyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gW1xuICAgICAgICAvLyBFeGNsdXJlIGxlcyBjb21wb3NhbnRzIGFkbWluIGVuIHByb2R1Y3Rpb25cbiAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvQWRtaW5Mb2dpbicsXG4gICAgICAgICcuL3NyYy9jb21wb25lbnRzL0FkbWluUGFuZWwnLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9BZG1pblVzZXJNYW5hZ2VtZW50JyxcbiAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvQ1JNU3lzdGVtJyxcbiAgICAgICAgJy4vc3JjL2NvbXBvbmVudHMvU3RhdHNDaGFydHMnLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9BZHZhbmNlZEFuYWx5dGljcycsXG4gICAgICAgICcuL3NyYy9jb21wb25lbnRzL0VtYWlsU2V0dGluZ3MnLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9Qcm9wZXJ0eU1hbmFnZW1lbnQnLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9QcmVzZW50YXRpb25JbWFnZU1hbmFnZXInLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9Db250ZW50TWFuYWdlcicsXG4gICAgICAgICcuL3NyYy9jb21wb25lbnRzL0Rlc2lnbkN1c3RvbWl6ZXInLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9BcHBvaW50bWVudEJvb2tpbmcnLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9MZWFkU2NvcmluZycsXG4gICAgICAgICcuL3NyYy9jb21wb25lbnRzL1NFT01hbmFnZXInLFxuICAgICAgICAnLi9zcmMvY29tcG9uZW50cy9QZXJmb3JtYW5jZU9wdGltaXplcidcbiAgICAgIF0gOiBbXVxuICAgIH1cbiAgfVxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ1AsY0FBYyxDQUFDLHNDQUFzQztBQUFBLFFBQ3JELCtCQUErQixJQUFJLE9BQU87QUFBQTtBQUFBLFFBQzFDLGdCQUFnQjtBQUFBLFVBQ2Q7QUFBQSxZQUNFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVk7QUFBQSxnQkFDVixZQUFZO0FBQUEsZ0JBQ1osZUFBZSxLQUFLLEtBQUssS0FBSztBQUFBO0FBQUEsY0FDaEM7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlLENBQUMsZUFBZSxnQkFBZ0IsY0FBYztBQUFBLE1BQzdELFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLFNBQVM7QUFBQSxRQUNULE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxVQUNMO0FBQUEsWUFDRSxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxNQUFNO0FBQUEsVUFDUjtBQUFBLFVBQ0E7QUFBQSxZQUNFLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsY0FBYztBQUFBLEVBQzFCO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixVQUFVLFNBQVMsZUFBZTtBQUFBO0FBQUEsUUFFaEM7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0YsSUFBSSxDQUFDO0FBQUEsSUFDUDtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=

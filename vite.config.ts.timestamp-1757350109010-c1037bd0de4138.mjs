// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: false
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json,webp}"],
        cleanupOutdatedCaches: true,
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
      includeAssets: ["icon-192.png", "icon-512.png", "manifest.json"],
      manifest: {
        name: "CERCLE PRIV\xC9 - Immobilier de Prestige",
        short_name: "CERCLE PRIV\xC9",
        description: "L'excellence immobili\xE8re en toute discr\xE9tion",
        theme_color: "#D97706",
        background_color: "#1F2937",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
  // Configuration robuste pour éviter les erreurs de parsing
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent",
      "empty-import-meta": "silent"
    },
    target: "es2020"
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-hot-toast"],
    exclude: ["@vite/client", "@vite/env"],
    force: true
  },
  build: {
    target: "es2015",
    minify: "terser",
    sourcemap: true,
    // Activer les sourcemaps pour le debug
    // Configuration robuste pour éviter les erreurs de build
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          utils: ["framer-motion", "lucide-react"]
        }
      },
      onwarn(warning, warn) {
        if (warning.code === "THIS_IS_UNDEFINED") return;
        if (warning.code === "EVAL") return;
        warn(warning);
      }
    },
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: true,
        pure_funcs: mode === "production" ? ["console.log", "console.warn"] : [],
        // Éviter les optimisations trop agressives qui peuvent causer des erreurs
        unsafe: false,
        unsafe_comps: false
      },
      mangle: {
        safari10: true
        // Compatibilité Safari
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1e3
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    https: false
    // Éviter les problèmes de certificat en preview
  },
  server: {
    port: 5173,
    strictPort: true,
    host: "0.0.0.0",
    hmr: {
      overlay: false,
      port: 24678,
      host: "localhost"
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
    "process.env.NODE_ENV": JSON.stringify(mode),
    global: "globalThis"
    // Polyfill pour certains environnements
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICBpbmplY3RSZWdpc3RlcjogJ2F1dG8nLFxuICAgICAgZGV2T3B0aW9uczoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyoue2pzLGNzcyxodG1sLGljbyxwbmcsc3ZnLGpzb24sd2VicH0nXSxcbiAgICAgICAgY2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuICAgICAgICBydW50aW1lQ2FjaGluZzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvaW1hZ2VzXFwucGV4ZWxzXFwuY29tXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAncGV4ZWxzLWltYWdlcycsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHtcbiAgICAgICAgICAgICAgICBtYXhFbnRyaWVzOiA1MCxcbiAgICAgICAgICAgICAgICBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzMCAvLyAzMCBqb3Vyc1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgaW5jbHVkZUFzc2V0czogWydpY29uLTE5Mi5wbmcnLCAnaWNvbi01MTIucG5nJywgJ21hbmlmZXN0Lmpzb24nXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdDRVJDTEUgUFJJVlx1MDBDOSAtIEltbW9iaWxpZXIgZGUgUHJlc3RpZ2UnLFxuICAgICAgICBzaG9ydF9uYW1lOiAnQ0VSQ0xFIFBSSVZcdTAwQzknLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0xcXCdleGNlbGxlbmNlIGltbW9iaWxpXHUwMEU4cmUgZW4gdG91dGUgZGlzY3JcdTAwRTl0aW9uJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjRDk3NzA2JyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyMxRjI5MzcnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHNjb3BlOiAnLycsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9pY29uLTE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9pY29uLTE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgICAgcHVycG9zZTogJ21hc2thYmxlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2ljb24tNTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnYW55J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL2ljb24tNTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSlcbiAgXSxcbiAgLy8gQ29uZmlndXJhdGlvbiByb2J1c3RlIHBvdXIgXHUwMEU5dml0ZXIgbGVzIGVycmV1cnMgZGUgcGFyc2luZ1xuICBlc2J1aWxkOiB7XG4gICAgbG9nT3ZlcnJpZGU6IHsgXG4gICAgICAndGhpcy1pcy11bmRlZmluZWQtaW4tZXNtJzogJ3NpbGVudCcsXG4gICAgICAnZW1wdHktaW1wb3J0LW1ldGEnOiAnc2lsZW50J1xuICAgIH0sXG4gICAgdGFyZ2V0OiAnZXMyMDIwJ1xuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1ob3QtdG9hc3QnXSxcbiAgICBleGNsdWRlOiBbJ0B2aXRlL2NsaWVudCcsICdAdml0ZS9lbnYnXSxcbiAgICBmb3JjZTogdHJ1ZVxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzMjAxNScsXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICBzb3VyY2VtYXA6IHRydWUsIC8vIEFjdGl2ZXIgbGVzIHNvdXJjZW1hcHMgcG91ciBsZSBkZWJ1Z1xuICAgIC8vIENvbmZpZ3VyYXRpb24gcm9idXN0ZSBwb3VyIFx1MDBFOXZpdGVyIGxlcyBlcnJldXJzIGRlIGJ1aWxkXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHZlbmRvcjogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcbiAgICAgICAgICB1dGlsczogWydmcmFtZXItbW90aW9uJywgJ2x1Y2lkZS1yZWFjdCddXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvbndhcm4od2FybmluZywgd2Fybikge1xuICAgICAgICAvLyBJZ25vcmVyIGxlcyB3YXJuaW5ncyBub24tY3JpdGlxdWVzXG4gICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdUSElTX0lTX1VOREVGSU5FRCcpIHJldHVybjtcbiAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ0VWQUwnKSByZXR1cm47XG4gICAgICAgIHdhcm4od2FybmluZyk7XG4gICAgICB9XG4gICAgfSxcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyxcbiAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSxcbiAgICAgICAgcHVyZV9mdW5jczogbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nID8gWydjb25zb2xlLmxvZycsICdjb25zb2xlLndhcm4nXSA6IFtdLFxuICAgICAgICAvLyBcdTAwQzl2aXRlciBsZXMgb3B0aW1pc2F0aW9ucyB0cm9wIGFncmVzc2l2ZXMgcXVpIHBldXZlbnQgY2F1c2VyIGRlcyBlcnJldXJzXG4gICAgICAgIHVuc2FmZTogZmFsc2UsXG4gICAgICAgIHVuc2FmZV9jb21wczogZmFsc2VcbiAgICAgIH0sXG4gICAgICBtYW5nbGU6IHtcbiAgICAgICAgc2FmYXJpMTA6IHRydWUgLy8gQ29tcGF0aWJpbGl0XHUwMEU5IFNhZmFyaVxuICAgICAgfVxuICAgIH0sXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiA0MTczLFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgaG9zdDogdHJ1ZSxcbiAgICBodHRwczogZmFsc2UgLy8gXHUwMEM5dml0ZXIgbGVzIHByb2JsXHUwMEU4bWVzIGRlIGNlcnRpZmljYXQgZW4gcHJldmlld1xuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogZmFsc2UsXG4gICAgICBwb3J0OiAyNDY3OCxcbiAgICAgIGhvc3Q6ICdsb2NhbGhvc3QnXG4gICAgfSxcbiAgICBodHRwczogZmFsc2UsXG4gICAgY29yczogdHJ1ZSxcbiAgICBwcm94eToge30sXG4gICAgZnM6IHtcbiAgICAgIHN0cmljdDogZmFsc2VcbiAgICB9XG4gIH0sXG4gIC8vIFZhcmlhYmxlcyBkJ2Vudmlyb25uZW1lbnQgc1x1MDBFOWN1cmlzXHUwMEU5ZXNcbiAgZGVmaW5lOiB7XG4gICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkobW9kZSksXG4gICAgZ2xvYmFsOiAnZ2xvYmFsVGhpcycgLy8gUG9seWZpbGwgcG91ciBjZXJ0YWlucyBlbnZpcm9ubmVtZW50c1xuICB9XG59KSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlO0FBR3hCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsU0FBUztBQUFBLElBQ1As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

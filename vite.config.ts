import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react()
  ],
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-hot-toast'],
    exclude: ['@vite/client', '@vite/env']
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
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
          utils: ['date-fns', 'react-hot-toast']
        }
      }
    },
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    hmr: {
      overlay: false,
      port: 24678
    },
    // Configuration HTTPS pour le développement
    https: false, // Laisser false pour éviter les problèmes de certificat en dev
    cors: true
  },
  // Optimisations pour HTTPS
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}));
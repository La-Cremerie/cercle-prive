import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [
          // Optimisation pour le tree-shaking
          ['babel-plugin-transform-imports', {
            'lucide-react': {
              transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
              preventFullImport: true
            }
          }]
        ]
      }
    })
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-hot-toast'],
    exclude: ['lucide-react']
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
          utils: ['date-fns', 'react-hot-toast']
        }
      },
      external: mode === 'production' ? [
        // Composants admin exclus en production
      ] : []
    }
  },
  server: {
    hmr: {
      overlay: false
    }
  }
}));

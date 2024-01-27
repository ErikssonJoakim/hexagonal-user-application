import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [autoprefixer({})]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../'),
      'React-App': path.resolve(__dirname, '.')
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        dir: path.resolve(__dirname, '../../../dist/react-app'),
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
}))

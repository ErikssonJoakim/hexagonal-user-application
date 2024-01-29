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
      '@': path.resolve(__dirname, 'src'),
      'React-App': path.resolve(__dirname, 'src/apps/react-app'),
      'Design-System': path.resolve(__dirname, 'src/apps/design-system')
    }
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },
  root: path.resolve(__dirname, 'src/apps/react-app'),
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'react-app': path.resolve(__dirname, '/index.html')
      },
      output: [
        {
          name: 'react-app',
          dir: path.resolve(__dirname, 'dist/react-app'),
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom']
          }
        }
      ]
    }
  }
}))

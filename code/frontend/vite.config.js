import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['diplom.by-byte.ru'],
    host: true,
    hmr: {
      host: 'diplom.by-byte.ru',
      protocol: 'wss',
      path: 'ws',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),

      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@js': path.resolve(__dirname, 'src/assets/js'),

      '@constants': path.resolve(__dirname, 'src/constants'),

      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
})

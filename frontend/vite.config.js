import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@context': path.resolve(__dirname, './src/context'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@storage': path.resolve(__dirname, './src/storage'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@router': path.resolve(__dirname, './src/router'),
      '@utils': path.resolve(__dirname, './src/utils')
    },
  },
  plugins: [react()],
  // base: "/",
  // preview: {
  //   port: 8080,
  //   strictPort: true,
  // },
  // server: {
  //   port: 5173,
  //   strictPort: true,
  //   host: true,
  //   origin: "http://localhost:5173",
  // },
})

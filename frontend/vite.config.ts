import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { BASE_URL } from './src/Constants'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: BASE_URL,
  server: {
    port: 4001,
    open: '/'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

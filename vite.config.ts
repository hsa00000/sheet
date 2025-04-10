import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
/* import vueDevTools from 'vite-plugin-vue-devtools' */

// https://vite.dev/config/
export default defineConfig({
  base: '/sheet/',
  plugins: [
    vue(),
    /* vueDevTools(), */
  ],
  define: {
    BUILD_DATE: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

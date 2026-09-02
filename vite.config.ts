import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    // The 3D stack is large and changes rarely; keep it in its own long-lived
    // chunks so edits to site copy do not invalidate the vendor download.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'three', test: /node_modules[\\/]three[\\/]/, priority: 3 },
            { name: 'r3f', test: /node_modules[\\/]@react-three[\\/]/, priority: 2 },
            { name: 'leva', test: /node_modules[\\/]leva[\\/]/, priority: 2 },
          ],
        },
      },
    },
  },
})

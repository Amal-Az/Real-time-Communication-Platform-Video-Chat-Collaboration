import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    fs: {
      allow: ['..'] // Autorise Vite à lire des fichiers en dehors de /client 
    }
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),  // créer un alias pour importer facilement les constantes
    },
  },
})
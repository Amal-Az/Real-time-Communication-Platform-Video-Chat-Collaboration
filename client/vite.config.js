import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // Écoute sur toutes les adresses (nécessaire pour Docker)
    port: 3000,      // On fixe le port à 3000 pour correspondre au docker-compose
    watch: {
      usePolling: true, // Force la détection des changements de fichiers sous Docker
    },
  },
})
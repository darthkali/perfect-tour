import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Neue Tailwind 4.x Vite Integration
  ],
  server: {
    port: 3000, // Üblicher Port für WebStorm
    open: true  // Automatisch im Browser öffnen
  },
  build: {
    outDir: 'dist',
    sourcemap: true // Für besseres Debugging
  }
})
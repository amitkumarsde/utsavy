import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Vite setup: React plus the Tailwind CSS plugin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})

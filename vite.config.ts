import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(), 
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
    fs: {
      allow: [path.resolve(__dirname)]
    }
  }
})

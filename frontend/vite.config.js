import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxies frontend API calls to the backend Node Express server
      '/api': 'http://localhost:3001'
    }
  }
})
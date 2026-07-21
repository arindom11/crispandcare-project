import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Vite dev server proxies all /api/* calls to the Express backend on :3001,
// so the frontend and backend behave like a single app during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})

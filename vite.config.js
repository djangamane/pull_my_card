import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // you can add multiple HTML entry points here if you port other pages
      input: {
        main: 'kid_reporter.vite.html'
      }
    }
  }
})

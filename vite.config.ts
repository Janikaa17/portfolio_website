import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio_website/',
  build: {
    outDir: 'dist',  
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },

});

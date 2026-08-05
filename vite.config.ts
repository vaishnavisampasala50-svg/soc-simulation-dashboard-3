import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves at https://<user>.github.io/soc-simulation-dashboard-3/
  // Without this base path, built assets 404 and the page renders blank.
  base: mode === 'production' ? '/soc-simulation-dashboard-3/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
}));

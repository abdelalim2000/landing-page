import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  base: './', // Use relative paths for deployment flexibility
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        work: resolve(__dirname, 'work.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        'work/aether-health': resolve(__dirname, 'work/aether-health.html'),
        'work/quantum-finance': resolve(__dirname, 'work/quantum-finance.html'),
        'work/nova-logistics': resolve(__dirname, 'work/nova-logistics.html'),
      }
    }
  }
});

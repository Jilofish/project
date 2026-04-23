import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

const backendTarget = "http://backend:5001";

export default defineConfig({
  // basicSsl() generates untrusted certificates automatically for local dev
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: true,
    https: true, // Let the plugin handle the certificate generation
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
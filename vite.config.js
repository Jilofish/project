import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import fs from 'fs';
const backendTarget = process.env.VITE_API_TARGET || 'http://localhost:5000';
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],  server: {
    host: true,
    https: {
      key: fs.readFileSync('./cert/key.pem'),
      cert: fs.readFileSync('./cert/cert.pem'),
    },
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

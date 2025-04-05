import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  },
  resolve: {
    alias: {
      'nova_act': path.resolve(__dirname, '../nova-act/nova_act'),
    },
  }
}); 
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendURI = process?.env?.BACKEND_URI || 'lol_ip_was_not_set';
console.log('Backend URI on: ', backendURI);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __VITE_BACKEND_URI__: JSON.stringify(backendURI),
  },
});

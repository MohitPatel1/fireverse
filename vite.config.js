import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'firebase/auth',
      '@capacitor-firebase/authentication',
      // Add other dependencies that need to be pre-bundled
    ],
  },
  css: {
    modules: {
      scopeBehaviour: 'local', // Use 'global' if you want global CSS
    },
  },
});


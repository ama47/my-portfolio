import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served by Cloudflare Pages from the domain root (the default
  // *.pages.dev URL today, a custom domain later), so base is '/'.
  base: '/',
  plugins: [react()],
  server: { port: 5173 },
});

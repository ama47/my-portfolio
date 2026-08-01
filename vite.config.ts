import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The site is published as a GitHub *project* page, so it is served from
  // /my-portfolio/ rather than the domain root. Set for dev as well as build:
  // scoping it to `command === 'build'` would leave the base path exercised
  // only in `preview`, so a newly added path that ignores it would look correct
  // in dev and 404 once deployed. Serving a custom domain later means changing
  // this to '/'.
  base: '/my-portfolio/',
  plugins: [react()],
  server: { port: 5173 },
});

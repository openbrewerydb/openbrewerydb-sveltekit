import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'open-brewery-db',
        project: 'obdb-sveltekit',
      },
    }),
    sveltekit(),
    tailwindcss(),
  ],
});

import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(new URL('./', import.meta.url)));
const r = (p: string) => resolve(rootDir, p);

export default defineConfig({
  resolve: {
    alias: {
      $lib: r('src/lib'),
    },
  },
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    exclude: [
      'node_modules/**',
      'tests/**/**.e2e.*',
      'tests/*.spec.ts',
    ],
    environment: 'node',
    globals: true,
    reporters: 'default',
  },
});

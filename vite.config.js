import adapter from '@sveltejs/adapter-cloudflare';
import { workerRoutes, spaRoutes } from './worker-routes.js';
import { mdsvex } from 'mdsvex';
import abbr from 'remark-abbr';
import urls from 'rehype-urls';
import slug from 'rehype-slug';
import autoLinkHeadings from 'rehype-autolink-headings';
import path from 'node:path';
import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

function addListClasses() {
  const classes = { ul: 'list-disc', ol: 'list-decimal' };
  const visit = (node) => {
    if (node.type === 'element' && classes[node.tagName]) {
      node.properties ??= {};
      node.properties.className = [
        ...(node.properties.className ?? []),
        classes[node.tagName],
      ];
    }
    node.children?.forEach(visit);
  };
  return (tree) => visit(tree);
}

function processUrl(url, node) {
  if (node.tagName === 'a') {
    node.properties.class = 'text-link';

    if (!url.href.startsWith('/')) {
      node.properties.target = '_blank';
      node.properties.rel = 'noreferrer';
    }
  }
}

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'open-brewery-db',
        project: 'obdb-sveltekit',
      },
      environment: process.env.NODE_ENV,
    }),

    sveltekit({
      compilerOptions: {},
      extensions: ['.svelte', '.svx', '.md'],
      preprocess: [
        mdsvex({
          extensions: ['.svx', '.md'],
          layout: {
            page: path.resolve(process.cwd(), 'src/layouts/page.svelte'),
            news: path.resolve(process.cwd(), 'src/layouts/news.svelte'),
          },
          remarkPlugins: [abbr],
          rehypePlugins: [
            [urls, processUrl],
            slug,
            [
              autoLinkHeadings,
              {
                behavior: 'append',
                properties: {
                  className: ['anchor-link'],
                  'aria-hidden': 'true',
                },
                content: { type: 'text', value: '#' },
              },
            ],
            addListClasses,
          ],
        }),
      ],

      adapter: adapter({
        fallback: 'spa',
        routes: { include: workerRoutes, exclude: ['<all>', ...spaRoutes] },
      }),
      paths: { origin: 'https://www.openbrewerydb.org' },
    }),
    tailwindcss(),
  ],
  test: {
    include: ['tests/**/*.unit.test.ts'],
  },
});

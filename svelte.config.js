import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import sveltePreprocess from 'svelte-preprocess';
import abbr from 'remark-abbr';
import urls from 'rehype-urls';
import slug from 'rehype-slug';
import autoLinkHeadings from 'rehype-autolink-headings';
import addClasses from 'rehype-add-classes';

function processUrl(url, node) {
  if (node.tagName === 'a') {
    node.properties.class = 'text-link';

    if (!url.href.startsWith('/')) {
      node.properties.target = '_blank';
      node.properties.rel = 'noreferrer';
    }
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // options passed to svelte.compile (https://svelte.dev/docs#compile-time-svelte-compile)
  compilerOptions: {},

  // an array of file extensions that should be treated as Svelte components
  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: adapter({
      // if true, will create a Netlify Edge Function rather
      // than using standard Node-based functions
      edge: false,

      // if true, will split your app into multiple functions
      // instead of creating a single one for the entire app.
      // if `edge` is true, this option cannot be used
      split: false,
    }),
    appDir: '_app',
    csp: {
      mode: 'auto',
      directives: {
        'default-src': undefined,
        // ...
      },
    },
    moduleExtensions: ['.js', '.ts'],
    files: {
      assets: 'static',
      hooks: { server: '', client: '' },
      lib: 'src/lib',
      params: 'src/params',
      routes: 'src/routes',
      serviceWorker: 'src/service-worker',
      appTemplate: 'src/app.html',
    },
    inlineStyleThreshold: 0,
    outDir: '.svelte-kit',
    paths: {
      assets: '',
      base: '',
    },
    serviceWorker: {
      register: true,
      files: (filepath) => !/\.DS_Store/.test(filepath),
    },
    version: {
      name: Date.now().toString(),
      pollInterval: 0,
    },
  },

  // SvelteKit uses vite-plugin-svelte. Its options can be provided directly here.
  // See the available options at https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md

  // options passed to svelte.preprocess (https://svelte.dev/docs#compile-time-svelte-preprocess)
  preprocess: [
    mdsvex({
      layout: {
        page: './src/layouts/page.svelte',
        blog: './src/layouts/blog.svelte',
      },
      remarkPlugins: [abbr], // adds support for footnote-like abbreviations
      rehypePlugins: [
        [urls, processUrl], // adds rel and target to <a> elements
        slug, // adds slug to <h1>-<h6> elements
        [autoLinkHeadings, { behavior: 'wrap' }], // adds a <a> around slugged <h1>-<h6> elements
        [addClasses, { ul: 'list-disc', ol: 'list-decimal' }], // add classes to these elements
      ],
    }),
    sveltePreprocess(),
  ],
};

export default config;

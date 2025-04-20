import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import { sveltePreprocess } from 'svelte-preprocess';
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

const config = {
  compilerOptions: {},
  extensions: ['.svelte', '.svx'],

  kit: {
    adapter: adapter({
      config: undefined,
      platformProxy: {
        configPath: undefined,
        environment: undefined,
        persist: undefined,
      },
      fallback: 'plaintext',
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
  },

  preprocess: [
    mdsvex({
      layout: {
        page: './src/layouts/page.svelte',
        blog: './src/layouts/blog.svelte',
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
            content: {
              type: 'text',
              value: '#',
            },
          },
        ],
        [addClasses, { ul: 'list-disc', ol: 'list-decimal' }],
      ],
    }),
    sveltePreprocess(),
  ],
};

export default config;

import adapter from "@sveltejs/adapter-netlify";
import { mdsvex } from "mdsvex";
import sveltePreprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // options passed to svelte.compile (https://svelte.dev/docs#compile-time-svelte-compile)
  compilerOptions: {},

  // an array of file extensions that should be treated as Svelte components
  extensions: [".svelte", ".svx"],

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
    amp: false,
    appDir: "_app",
    browser: {
      hydrate: true,
      router: true,
    },
    csp: {
      mode: "auto",
      directives: {
        "default-src": undefined,
        // ...
      },
    },
    endpointExtensions: [".js", ".ts"],
    files: {
      assets: "static",
      hooks: "src/hooks",
      lib: "src/lib",
      params: "src/params",
      routes: "src/routes",
      serviceWorker: "src/service-worker",
      template: "src/app.html",
    },
    floc: false,
    inlineStyleThreshold: 0,
    methodOverride: {
      parameter: "_method",
      allowed: [],
    },
    outDir: ".svelte-kit",
    package: {
      dir: "package",
      emitTypes: true,
      // excludes all .d.ts and files starting with _ as the name
      exports: (filepath) => !/^_|\/_|\.d\.ts$/.test(filepath),
      files: () => true,
    },
    paths: {
      assets: "",
      base: "",
    },
    prerender: {
      concurrency: 1,
      crawl: true,
      default: false,
      enabled: true,
      entries: ["*"],
      onError: "fail",
    },
    routes: (filepath) =>
      !/(?:(?:^_|\/_)|(?:^\.|\/\.)(?!well-known))/.test(filepath),
    serviceWorker: {
      register: true,
      files: (filepath) => !/\.DS_Store/.test(filepath),
    },
    trailingSlash: "never",
    version: {
      name: Date.now().toString(),
      pollInterval: 0,
    },
    vite: () => ({}),
  },

  // SvelteKit uses vite-plugin-svelte. Its options can be provided directly here.
  // See the available options at https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/config.md

  // options passed to svelte.preprocess (https://svelte.dev/docs#compile-time-svelte-preprocess)
  preprocess: [mdsvex(), sveltePreprocess()],
};

export default config;

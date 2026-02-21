const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const sveltePlugin = require('eslint-plugin-svelte');
const svelteParser = require('svelte-eslint-parser');
const prettierConfig = require('eslint-config-prettier');

const svelteRecommended =
  sveltePlugin.configs?.['flat/recommended'] ||
  sveltePlugin.configs.recommended;

module.exports = [
  {
    ignores: ['*.cjs'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,cjs,mjs,ts}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 2020,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    plugins: {
      svelte: sveltePlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...svelteRecommended.rules,
      ...tsPlugin.configs.recommended.rules,
    },
  },
  {
    rules: {
      ...prettierConfig.rules,
    },
  },
];

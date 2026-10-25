import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    plugins: ['typescript'],
    env: {
      browser: true,
      node: true,
      es2022: true,
    },
    categories: {
      correctness: 'error',
    },
    ignorePatterns: ['**/dist/**', '**/.svelte-kit/**', '**/coverage/**', '**/test-results/**', '**/playwright-report/**', '**/*.cjs'],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    overrides: [
      {
        files: ['**/demo/**'],
        rules: { 'no-loss-of-precision': 'off' },
      },
      {
        files: ['packages/svelte/**'],
        env: { svelte: true, browser: true },
      },
      {
        files: ['packages/vue/**'],
        env: { vue: true, browser: true },
      },
      {
        files: ['**/*.spec.ts', '**/*.spec.tsx'],
        env: { vitest: true },
      },
    ],
  },
  fmt: {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 140,
    arrowParens: 'avoid',
    sortPackageJson: false,
    ignorePatterns: [],
    overrides: [
      {
        files: ['packages/svelte/**'],
        options: {
          useTabs: true,
          trailingComma: 'none',
          printWidth: 100,
        },
      },
    ],
  },
});

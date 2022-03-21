/// <reference types="vitest" />

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts({ insertTypesEntry: true })],
  build: {
    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: { regex: '^_' },
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StaticMapsVue',
      fileName: format => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd', 'iife'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', '@staticmaps/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@staticmaps/core': 'StaticMapsCore',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});

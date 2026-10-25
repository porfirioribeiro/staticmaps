import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    minify: true,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'StaticMapsReact',
      fileName: format => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd', 'iife'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom', '@staticmaps/core'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDom',
          '@staticmaps/core': 'StaticMapsCore',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});

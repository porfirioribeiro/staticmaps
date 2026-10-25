import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, lazyPlugins } from 'vite-plus';
import dts from 'vite-plugin-dts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: lazyPlugins(() => [dts({ insertTypesEntry: true })]),
  build: {
    minify: true,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
      name: 'StaticMapsCore',
      fileName: format => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd', 'iife'],
    },
  },
  test: {
    environment: 'node',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});

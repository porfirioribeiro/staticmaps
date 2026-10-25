import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, lazyPlugins } from 'vite-plus';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: lazyPlugins(() => [vue(), dts({ insertTypesEntry: true })]),
  build: {
    minify: true,
    lib: {
      entry: path.resolve(dirname, 'src/index.ts'),
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
    environment: 'happy-dom',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});

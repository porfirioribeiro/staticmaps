import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ dts({ insertTypesEntry: true })],
  build: {
    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: { regex: '^_' },
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StaticMapsCore',
      fileName: format => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd', 'iife'],
    },
  },
});

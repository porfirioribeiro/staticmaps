import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' }), dts({ insertTypesEntry: true })],
  build: {
    minify: 'terser',
    terserOptions: {
      mangle: {
        properties: { regex: '^_' },
      },
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'StatricMapsReact',
      fileName: format => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd'],
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDom',
        },
      },
    },
  },
});

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [react()],
  pack: {
    entry: 'src/index.ts',
    format: ['es'],
    platform: 'browser',
    dts: true,
    minify: true,
    clean: true,
  },
  test: {
    environment: 'jsdom',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});

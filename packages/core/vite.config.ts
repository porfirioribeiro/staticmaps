import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: 'src/index.ts',
    format: ['es'],
    platform: 'browser',
    dts: true,
    minify: true,
    clean: true,
  },
  test: {
    environment: 'node',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});

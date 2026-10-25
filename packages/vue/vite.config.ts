import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [vue()],
  pack: {
    entry: 'src/index.ts',
    format: ['es'],
    platform: 'browser',
    dts: false,
    minify: true,
    clean: true,
    plugins: [vue()],
  },
  test: {
    environment: 'happy-dom',
    coverage: { provider: 'v8', reporter: ['text', 'lcov'] },
  },
});

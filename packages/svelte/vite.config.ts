import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
	plugins: lazyPlugins(() => [sveltekit({ adapter: adapter(), preprocess: vitePreprocess() })])
});

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		sourcemap: "inline"
	},
	define: {
		global: 'window',
		process: { env: {} }
	}
});

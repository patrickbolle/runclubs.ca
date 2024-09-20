import adapter from '@sveltejs/adapter-cloudflare'; // or whichever adapter you're using
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			base: '',
			assets: ''
		}
	}
};

export default config;


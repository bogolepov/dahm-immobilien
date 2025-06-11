// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://dahm-ivg.de',
	integrations: [
		icon(),
		vue(),
		sitemap({
			filter: page => page !== 'https://dahm-ivg.de/404/',
		}),
	],
	adapter: netlify(),
});

// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://dahm-immobilien-verwaltung.de',
	integrations: [
		icon(),
		vue(),
		sitemap({
			filter: page => page !== 'https://dahm-immobilien-verwaltung.de/404/',
		}),
	],
	adapter: netlify(),
});

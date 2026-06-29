// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

function needToSiteMap(pageURL) {
	let url = pageURL.toLowerCase();
	switch (url) {
		case 'https://dahm-immobilien-verwaltung.de/404/':
		case 'https://dahm-immobilien-verwaltung.de/apanel/':
			return false;

		default:
			return true;
	}
}

// https://astro.build/config
export default defineConfig({
	site: 'https://dahm-immobilien-verwaltung.de',
	integrations: [
		icon(),
		vue(),
		sitemap({
			filter: page => needToSiteMap(page),
		}),
	],
	adapter: netlify(),
});

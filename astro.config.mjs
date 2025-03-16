// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import vue from '@astrojs/vue';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
	integrations: [icon(), vue()],
	adapter: netlify(),
});

import { ref } from 'vue';
import { type CookieConsent } from '@scripts/cookies';

const defaultConsent: CookieConsent = {
	necessary: true,
	google_maps: false /*, youtube: false, google_analytics: false*/,
};

export const cccInitialized = ref<boolean>(false);
export const cccSettingsShow = ref<boolean>(false);
export const cccConsent = ref<CookieConsent>(defaultConsent);

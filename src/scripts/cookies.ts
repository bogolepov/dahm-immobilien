// import Dahm from '@data/dahm.json';
const CONSENT_KEY: string = 'website_consent';

export type SameSiteOption = 'lax' | 'strict' | 'none';
export type CookieConsent = {
	necessary: boolean;
	google_maps: boolean;
	open_street_map: boolean /* youtube: boolean; google_analytics: boolean */;
};
export type CookieOptions = {
	path?: string;
	domain?: string;
	secure?: true;
	expires?: string;
	httpOnly?: true;
	maxAge?: number;
	sameSite?: SameSiteOption;
};

export function getConsent(): CookieConsent | undefined {
	let cookie_value = getCookie(CONSENT_KEY);
	if (!cookie_value) return undefined;

	const consent: CookieConsent = {
		necessary: true,
		google_maps: false,
		open_street_map: false /*, youtube: false, google_analytics: false*/,
	};
	let consentKeys = Object.keys(consent);

	cookie_value
		.split(';')
		.map(item => item.trim())
		.forEach(param => {
			if (consentKeys.includes(param)) consent[param as keyof CookieConsent] = true;
		});
	consent.necessary = true;
	return consent;
}

export function setConsent(consent: CookieConsent): void {
	consent.necessary = true;

	let value: string = '';
	for (let key in consent) {
		if (consent[key as keyof CookieConsent]) value += (value !== '' ? '; ' : '') + key;
	}

	let date: Date = new Date();
	date.setFullYear(date.getFullYear() + 1);

	setCookie(CONSENT_KEY, value, {
		path: '/',
		// domain: Dahm.domain,
		secure: true,
		expires: date.toUTCString(),
		sameSite: 'lax',
	});
}

function getCookie(key: string): undefined | string {
	if (!document.cookie) return undefined;
	let cookie = document.cookie.split(';').find(item => item.split('=')[0].trim() === key);
	return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
}

function setCookie(name: string, value: string, options: CookieOptions) {
	let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

	for (let optionKey in options) {
		updatedCookie += '; ' + optionKey;
		let optionValue: string | boolean | number | undefined = options[optionKey as keyof typeof options];
		if (optionValue !== true) {
			updatedCookie += '=' + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

export type ConsentInfo = {
	title: string;
	description: string;
	type: string;
};
export const ConsentInfos: {
	necessary: ConsentInfo;
	google_maps: ConsentInfo;
	open_street_map: ConsentInfo;
	youtube: ConsentInfo;
	immob_scout24: ConsentInfo;
	google_analytics: ConsentInfo;
} = {
	necessary: {
		title: 'Website-Funktionen (immer erforderlich)',
		description: 'Speichern der gewählten Datenschutzeinstellungen',
		type: 'Notwendige Funktionen',
	},
	google_maps: {
		title: 'Google Maps',
		description: 'Einbinden von Google Maps, um die Adresse anzuzeigen',
		type: 'Externe Dienste',
	},
	open_street_map: {
		title: 'OpenStreetMap',
		description: 'Einbinden von OpenStreetMap, um die verwaltete Objekte anzuzeigen',
		type: 'Externe Dienste',
	},
	youtube: {
		title: 'Youtube',
		description: 'Einbinden von Videos von Youtube im sog. erweiterten Datenschutzmodus',
		type: 'Externe Dienste',
	},
	immob_scout24: {
		title: 'ImmobilienScout24',
		description: 'Einbinden eines Widgets von ImmobilienScout24',
		type: 'Externe Dienste',
	},
	google_analytics: {
		title: 'Google Analytics 4',
		description:
			'Anonyme Auswertung von Besucherzugriffen mit Google Analytics 4 (datenschutzfreundlich mit IP-Adressen-Anonymisierung)',
		type: 'Besucher-Statistik',
	},
};

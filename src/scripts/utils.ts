import {
	extractSchemaFromJson,
	zPropertiesCache,
	zPropertyFormData,
	type Properties,
	type PropertiesCache,
	type PropertyFormData,
	type PropertyFormState,
} from './zod';

export function getDayName(shortName: string): string | undefined {
	switch (shortName.toLowerCase()) {
		case 'mo':
			return 'Montag';
		case 'di':
			return 'Dienstag';
		case 'mi':
			return 'Mittwoch';
		case 'do':
			return 'Donnerstag';
		case 'fr':
			return 'Freitag';
		case 'sa':
			return 'Samstag';
		case 'so':
			return 'Sonntag';
	}
	return undefined;
}

export function getDuration1991(): number {
	return new Date().getFullYear() - 1991;
}
export function getDuration2025(): number {
	return new Date().getFullYear() - 2025;
}

const PROPERTIES__LS_KEY = 'properties_db';
const PROPERTIES__CACHE_TTL = 2 * 60 * 1000; // 2 min

// all undefined and null fields will be excluded
// function compactObject<T extends object>(obj: T): Partial<T> {
// 	return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined)) as Partial<T>;
// }
function compactObject<T extends object>(obj: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => {
			if (value === null) return false;
			if (value === undefined) return false;

			if (typeof value === 'string' && value.trim() === '') {
				return false;
			}

			if (typeof value === 'object') {
				//
				return false;
			}

			return true;
		}),
	) as Partial<T>;
}

export function compactDeep<T>(value: T): T | undefined {
	// null / undefined
	if (value == null) {
		return undefined;
	}

	// strings
	if (typeof value === 'string') {
		const trimmed = value.trim();

		return trimmed === '' ? undefined : (trimmed as T);
	}

	// arrays
	if (Array.isArray(value)) {
		const compactedArray = value.map(compactDeep).filter(v => v !== undefined);

		return compactedArray.length > 0 ? (compactedArray as T) : undefined;
	}

	// objects
	if (typeof value === 'object') {
		const compactedEntries = Object.entries(value as object)
			.map(([key, val]) => [key, compactDeep(val)] as const)
			.filter(([_, val]) => val !== undefined);

		if (compactedEntries.length === 0) {
			return undefined;
		}

		return Object.fromEntries(compactedEntries) as T;
	}

	// numbers / booleans
	return value;
}
export function compactDeepCopy<T>(value: T): T | undefined {
	return compactDeep<T>(JSON.parse(JSON.stringify(value)));
}

function isDefined<T>(value: T | undefined | null): value is T {
	return value != null;
}

export function ensurePropertyFormData(data: PropertyFormData): PropertyFormState {
	return {
		...data,

		address: data.address ? { ...data.address, ...{ hidden_fields: data.address.hidden_fields ?? [] } } : { hidden_fields: [] },
		finance: data.finance ? { ...data.finance, ...{ hidden_fields: data.finance.hidden_fields ?? [] } } : { hidden_fields: [] },
		areas: data.areas ? { ...data.areas, ...{ hidden_fields: data.areas.hidden_fields ?? [] } } : { hidden_fields: [] },
		spaces: data.spaces ? { ...data.spaces, ...{ hidden_fields: data.spaces.hidden_fields ?? [] } } : { hidden_fields: [] },
		tech_details: data.tech_details
			? { ...data.tech_details, ...{ hidden_fields: data.tech_details.hidden_fields ?? [] } }
			: { hidden_fields: [] },
	};
}

export function propertiesToCache(objects: Properties) {
	// const compactedObjectsSale = objects.objectsSale.map(compactObject);
	const cache: PropertiesCache = {
		timestamp: Date.now(),
		objectsSale: objects.objectsSale.map(obj => compactDeep(obj)).filter(isDefined),
		objectsRent: objects.objectsRent.map(obj => compactDeep(obj)).filter(isDefined),
	};
	console.log('**** CACHE: ', cache);
	localStorage.setItem(PROPERTIES__LS_KEY, JSON.stringify(cache));
}

export function propertiesFromCache(): Properties | undefined {
	const cache = localStorage.getItem(PROPERTIES__LS_KEY);
	if (!cache) return undefined;

	const objectsCache = extractSchemaFromJson(zPropertiesCache, cache);
	if (!objectsCache) return undefined;

	if (Date.now() - objectsCache.timestamp > PROPERTIES__CACHE_TTL) {
		localStorage.removeItem(PROPERTIES__LS_KEY);
		return undefined;
	}

	const properties: Properties = {
		objectsSale: objectsCache.objectsSale.map(item => zPropertyFormData.parse(item)),
		objectsRent: objectsCache.objectsRent.map(item => zPropertyFormData.parse(item)),
	};

	return properties;
}

export function createPropertyFormData() {
	return zPropertyFormData.parse({});
}

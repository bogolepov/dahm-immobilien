import { propertiesFromCache, propertiesToCache } from '@scripts/utils';
import type { Properties } from '@scripts/zod';
import { getPropertiesAdmin, getPropertiesUser } from '@scripts/readSupabase';

export function useObjectsData() {
	async function getProperties(apanel: boolean) {
		let properties;
		if (apanel) {
			properties = await getPropertiesAdmin();
			// TODO: validate properties ?
		} else {
			// TODO: validate properties ?
			properties = propertiesFromCache();
			if (!properties) {
				properties = await getPropertiesUser();
				if (properties) propertiesToCache(properties);
			}
		}
		return properties;
	}

	return { getProperties };
}

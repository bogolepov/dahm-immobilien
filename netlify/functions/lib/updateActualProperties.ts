import type { Property } from '@scripts/supabase_types';
import { writeSupabase } from './writeSupabase';
import { SUPABASE_PROPERTIES_ACTUAL_TABLE } from '@scripts/consts';
import type { PropertyFormData } from '@scripts/zod';
import { compactDeep } from '@scripts/utils';

export async function updateActualProperties(property: Property) {
	if (!writeSupabase) {
		console.error('writeDB invalid');
		return;
	}

	if (!property.show || property.status === 'draft') {
		await writeSupabase.from(SUPABASE_PROPERTIES_ACTUAL_TABLE).delete().eq('id', property.id);
	} else {
		cleanHidden(property as PropertyFormData);
		const compactActual = compactDeep(property);
		const { created_at, show, ...actualDB } = compactActual as Property;
		const { error: actualError } = await writeSupabase
			.from(SUPABASE_PROPERTIES_ACTUAL_TABLE)
			.upsert(actualDB)
			.eq('id', actualDB.id)
			.select()
			.single();

		if (actualError) console.error(actualError);
	}
}

function cleanHidden(property: PropertyFormData) {
	if (!property) return;

	clearHiddenFields(property.address);
	clearHiddenFields(property.finance);
	clearHiddenFields(property.areas);
	clearHiddenFields(property.spaces);
	clearHiddenFields(property.tech_details);
}

function clearHiddenFields<T extends Record<string, unknown>>(section: (T & { hidden_fields?: (keyof T)[] }) | null | undefined) {
	if (!section) return;

	section.hidden_fields?.forEach(key => {
		(section as any)[key] = null;
	});

	section.hidden_fields = [];
}

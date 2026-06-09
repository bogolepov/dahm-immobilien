import { createClient } from '@supabase/supabase-js';
import type { Properties, PropertyFormData } from './zod';
import { SUPABASE_PROPERTIES_ACTUAL_TABLE, SUPABASE_PROPERTIES_TABLE } from './consts';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_READ_KEY;

export const readSupabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : undefined;

export async function getPropertiesUser() {
	if (!readSupabase) return undefined;

	const { data, error } = await readSupabase.from(SUPABASE_PROPERTIES_ACTUAL_TABLE).select('*');

	if (error) {
		console.error(error);
		return undefined;
	}

	const properties: PropertyFormData[] = data ?? [];

	const objects: Properties = {
		objectsSale: properties.filter(prop => prop.action_type === 'sale'),
		objectsRent: properties.filter(prop => prop.action_type === 'rent'),
	};
	return objects;
}

export async function getPropertiesAdmin() {
	if (!readSupabase) return undefined;

	const { data, error } = await readSupabase.from(SUPABASE_PROPERTIES_TABLE).select('*');

	if (error) {
		console.error(error);
		return undefined;
	}

	const properties: PropertyFormData[] = data ?? [];

	const objects: Properties = {
		objectsSale: properties.filter(prop => prop.action_type === 'sale'),
		objectsRent: properties.filter(prop => prop.action_type === 'rent'),
	};
	return objects;
}

export async function getUserRole(userId: string) {
	if (!readSupabase) return undefined;

	const { data, error } = await readSupabase.from('profiles').select('role').eq('id', userId).single();
	if (!error) return data.role;
	return undefined;
}

import {
	SUPABASE_EXPOSE_STORAGE,
	SUPABASE_IMAGE_STORAGE,
	SUPABASE_PROPERTIES_ACTUAL_TABLE,
	SUPABASE_PROPERTIES_TABLE,
} from '@scripts/consts';
import { detectMime, getFileExtension } from '@scripts/file';
import { supabase } from '@scripts/supabase';
import { compactDeep } from '@scripts/utils';
import { type PropertyFormData, type UpdatePropertiesShowInput } from '@scripts/zod';
import type { Property } from './supabase_types';

const uploadFiles = async (property: PropertyFormData, fileExpose: File | null, fileImage: File | null) => {
	if (!supabase) return false;

	if (!fileExpose && !fileImage) return true;

	const strDate = `_${Date.now()}`;

	try {
		if (fileImage) {
			const filename = property.slug + strDate + '.' + getFileExtension(fileImage.name);
			const mimeType = await detectMime(fileImage);

			const { data, error } = await supabase.storage
				.from(SUPABASE_IMAGE_STORAGE)
				.upload(filename, fileImage, { upsert: false, ...(mimeType && { contentType: mimeType }) });

			if (error) throw new Error(`Upload failed for ${fileImage.name}`, { cause: error });

			const { data: publicUrlData } = supabase.storage.from(SUPABASE_IMAGE_STORAGE).getPublicUrl(data.path);
			property.url_image = publicUrlData.publicUrl;
		}

		if (fileExpose) {
			const filename = property.slug + strDate + '.' + getFileExtension(fileExpose.name);
			const mimeType = await detectMime(fileExpose);

			const { data, error } = await supabase.storage
				.from(SUPABASE_EXPOSE_STORAGE)
				.upload(filename, fileExpose, { upsert: false, ...(mimeType && { contentType: mimeType }) });

			if (error) throw new Error(`Upload failed for ${fileExpose.name}`, { cause: error });

			const { data: publicUrlData } = supabase.storage.from(SUPABASE_EXPOSE_STORAGE).getPublicUrl(data.path);
			property.url_expose = publicUrlData.publicUrl;
		}

		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

export const savePropertyDB = async (
	property: PropertyFormData,
	fileExpose: File | null,
	fileImage: File | null,
	handler: (ok: boolean, error?: string) => void,
) => {
	if (!supabase) {
		handler(false, 'System Fehler: supabase #1 ');
		return;
	}

	if (fileExpose || fileImage) {
		const ok = await uploadFiles(property, fileExpose, fileImage);
		if (!ok) {
			handler(false, 'Fehler beim Hochladen der Dateien auf den Server');
			return;
		}
	}

	const compactDB = compactDeep(property);
	if (!compactDB) {
		handler(false, 'System Fehler: compactDeep #1 ');
		return;
	}

	const { id, ...propData } = compactDB;

	if (!propData.property_type) propData.property_type = null;
	if (!propData.url_expose) propData.url_expose = null;
	if (!propData.url_image) propData.url_image = null;
	if (!propData.description) propData.description = null;
	if (!propData.address) propData.address = {};
	if (!propData.finance) propData.finance = {};
	if (!propData.areas) propData.areas = {};
	if (!propData.spaces) propData.spaces = {};
	if (!propData.tech_details) propData.tech_details = {};

	const { data, error } = id
		? await supabase.from(SUPABASE_PROPERTIES_TABLE).update(propData).eq('id', property.id).select().single()
		: await supabase.from(SUPABASE_PROPERTIES_TABLE).insert(propData).select().single();

	if (error) {
		console.error(error);
		handler(false, 'Daten konnten nicht auf dem Server gespeichert werden.');
		return;
	}

	const { error: actualError } = await updateActualProperties(data);
	if (actualError) {
		handler(false, actualError);
		return;
	}

	handler(true);
};

export const saveShowPropertiesDB = async (properties: UpdatePropertiesShowInput) => {
	if (!supabase) return;

	for (const { id, show } of properties) {
		const { data, error } = await supabase.from(SUPABASE_PROPERTIES_TABLE).update({ show }).eq('id', id).select().single();
		if (!error) {
			await updateActualProperties(data);
		}
	}
};

export const deletePropertyDB = async (id: number) => {
	if (!supabase) return;

	const { error } = await supabase.from(SUPABASE_PROPERTIES_TABLE).delete().eq('id', id);
	if (error) console.error(error);
};

async function updateActualProperties(property: Property) {
	if (!supabase) return { error: 'System Fehler: supabase #1' };

	if (!property.show || property.status === 'draft') {
		await supabase.from(SUPABASE_PROPERTIES_ACTUAL_TABLE).delete().eq('id', property.id);
		return {};
	} else {
		cleanHidden(property as PropertyFormData);
		const { created_at, show, ...actualDB } = property as Property;
		const { error: actualError } = await supabase
			.from(SUPABASE_PROPERTIES_ACTUAL_TABLE)
			.upsert(actualDB)
			.eq('id', actualDB.id)
			.select()
			.single();

		if (actualError) {
			console.error(actualError);
			return { error: 'System Fehler: supabase actual upsert #1' };
		}
	}
	return {};
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

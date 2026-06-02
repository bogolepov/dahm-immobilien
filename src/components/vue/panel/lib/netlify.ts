import { SUPABASE_EXPOSE_STORAGE, SUPABASE_IMAGE_STORAGE } from '@scripts/consts';
import { getFileExtension } from '@scripts/file';
import { readSupabase } from '@scripts/readSupabase';
import { compactDeepCopy } from '@scripts/utils';
import { extractSchemaFromJson, zUploadUrlsOutput, type PropertyFormData, type UploadUrlsInput } from '@scripts/zod';

const uploadFiles = async (property: PropertyFormData, fileExpose: File | null, fileImage: File | null) => {
	if (!readSupabase) return false;

	if (!fileExpose && !fileImage) return true;

	const strDate = `_${Date.now()}`;

	const input: UploadUrlsInput = {};
	if (fileExpose) input.exposeFilename = property.slug + strDate + '.' + getFileExtension(fileExpose.name);
	if (fileImage) input.imageFilename = property.slug + strDate + '.' + getFileExtension(fileImage.name);

	try {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(input),
		};

		const response = await fetch('/.netlify/functions/getUploadUrls', options);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data);
		}

		const output = extractSchemaFromJson(zUploadUrlsOutput, JSON.stringify(data));
		if (!output) throw new Error('Invalid response data: extractSchemaFromJson(zUploadUrlsOutput)');

		if (fileExpose && output.expose) {
			const uploadRes = await fetch(output.expose.signedUrl, {
				method: 'PUT',
				headers: { 'Content-Type': fileExpose.type },
				body: fileExpose,
			});
			if (!uploadRes.ok) {
				throw new Error(`Upload failed for ${fileExpose.name}`);
			}

			const { data } = readSupabase.storage.from(SUPABASE_EXPOSE_STORAGE).getPublicUrl(output.expose.path);
			property.url_expose = data.publicUrl;
		}

		if (fileImage && output.image) {
			const uploadRes = await fetch(output.image.signedUrl, {
				method: 'PUT',
				headers: { 'Content-Type': fileImage.type },
				body: fileImage,
			});
			if (!uploadRes.ok) {
				throw new Error(`Upload failed for ${fileImage.name}`);
			}

			const { data } = readSupabase.storage.from(SUPABASE_IMAGE_STORAGE).getPublicUrl(output.image.path);
			property.url_image = data.publicUrl;
		}

		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const netlifySaveObject = async (
	property: PropertyFormData,
	fileExpose: File | null,
	fileImage: File | null,
	handler: (ok: boolean, error?: string) => void,
) => {
	if (fileExpose || fileImage) {
		const ok = await uploadFiles(property, fileExpose, fileImage);
		if (!ok) {
			handler(false, 'Fehler beim Hochladen der Dateien auf den Server');
			return;
		}
	}

	try {
		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
			body: JSON.stringify(compactDeepCopy(property)),
		};

		const response = await fetch('/.netlify/functions/addProperty', options);
		if (response.ok) handler(true);
		else handler(false, 'Daten konnten nicht auf dem Server gespeichert werden.');
	} catch (err) {
		console.error(err);
		handler(false, (err as Error).message);
	}
};

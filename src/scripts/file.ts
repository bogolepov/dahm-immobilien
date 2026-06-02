import {
	ALLOWED_EXPOSE_EXTENSIONS,
	ALLOWED_EXPOSE_TYPES,
	ALLOWED_IMAGE_EXTENSIONS,
	ALLOWED_IMAGE_TYPES,
	MAX_EXPOSE_SIZE,
	MAX_IMAGE_SIZE,
} from './consts';

export function getFileExtension(name: string) {
	return name.split('.').pop()?.toLowerCase();
}

export type FileCheck = { ok: boolean; errorMsg?: string };

export async function checkImageFile(file: File): Promise<FileCheck> {
	const result: FileCheck = { ok: false };
	// MIME type
	if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.type !== (await detectMime(file))) {
		result.errorMsg = 'Nur JPG/JPEG, PNG oder WEBP erlaubt';
		return result;
	}
	// extension
	const extension = getFileExtension(file.name);
	if (!extension || !ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
		result.errorMsg = 'Ungültige Dateiendung';
		return result;
	}
	// size
	if (file.size > MAX_IMAGE_SIZE) {
		result.errorMsg = `Bild darf maximal ${MAX_IMAGE_SIZE / (1024 * 1024)} MB groß sein`;
		return result;
	}

	result.ok = true;
	return result;
}

export async function checkExposeFile(file: File): Promise<FileCheck> {
	const result: FileCheck = { ok: false };

	// MIME type
	if (!ALLOWED_EXPOSE_TYPES.includes(file.type) || file.type !== (await detectMime(file))) {
		result.errorMsg = 'Nur PDF Dateien erlaubt';
		return result;
	}
	// extension
	const extension = getFileExtension(file.name);
	if (!extension || !ALLOWED_EXPOSE_EXTENSIONS.includes(extension)) {
		result.errorMsg = 'Ungültige Dateiendung';
		return result;
	}
	// size
	if (file.size > MAX_EXPOSE_SIZE) {
		result.errorMsg = `Expose darf maximal ${MAX_EXPOSE_SIZE / (1024 * 1024)} MB groß sein`;
		return result;
	}

	result.ok = true;
	return result;
}

async function detectMime(file: File) {
	const buffer = new Uint8Array(await file.slice(0, 16).arrayBuffer());

	// PNG
	if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
		return 'image/png';
	}

	// JPEG
	if (buffer[0] === 0xff && buffer[1] === 0xd8) {
		return 'image/jpeg';
	}

	// WEBP
	if (
		buffer[0] === 0x52 &&
		buffer[1] === 0x49 &&
		buffer[2] === 0x46 &&
		buffer[3] === 0x46 &&
		buffer[8] === 0x57 &&
		buffer[9] === 0x45 &&
		buffer[10] === 0x42 &&
		buffer[11] === 0x50
	) {
		return 'image/webp';
	}

	// PDF
	if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
		return 'application/pdf';
	}

	return undefined;
}

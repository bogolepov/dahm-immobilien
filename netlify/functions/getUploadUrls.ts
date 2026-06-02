import type { Handler, HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { authMiddleware } from './lib/authMiddleware';
import { extractSchemaFromJson, zUploadUrlsInput, type UploadUrlsOutput } from '@scripts/zod';
import { writeSupabase } from './lib/writeSupabase';
import { SUPABASE_IMAGE_STORAGE, SUPABASE_EXPOSE_STORAGE } from '@scripts/consts';

// fetch('/.netlify/functions/getUploadUrls', {
// 	credentials: 'include',
// });

function response(resCode: number, resObject: Object): HandlerResponse {
	if (resCode >= 400) console.error(resCode + ': ' + resObject);
	return {
		body: JSON.stringify(resObject),
		statusCode: resCode,
	};
}

export const handler: Handler = async (event, context) => {
	return await authMiddleware('admin', processHandler, event, context);
};

async function processHandler(event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
	if (!event.body) return response(400, 'Bad request');

	if (!writeSupabase) return response(500, 'writeDB invalid');

	const input = extractSchemaFromJson(zUploadUrlsInput, event.body);
	if (!input || (!input.exposeFilename?.length && !input.imageFilename?.length)) return response(400, 'Bad request');

	const output: UploadUrlsOutput = {};

	if (input.exposeFilename?.length) {
		const { data, error } = await writeSupabase.storage.from(SUPABASE_EXPOSE_STORAGE).createSignedUploadUrl(input.exposeFilename);
		if (error) return response(500, error);

		output.expose = { filename: input.exposeFilename, signedUrl: data.signedUrl, path: data.path };
	}

	if (input.imageFilename?.length) {
		const { data, error } = await writeSupabase.storage.from(SUPABASE_IMAGE_STORAGE).createSignedUploadUrl(input.imageFilename);
		if (error) return response(500, error);

		output.image = { filename: input.imageFilename, signedUrl: data.signedUrl, path: data.path };
	}

	return response(200, output);
}

import type { Handler, HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { authMiddleware } from './lib/authMiddleware';
import { writeSupabase } from './lib/writeSupabase';
import { extractSchemaFromJson, zPropertyFormData } from '@scripts/zod';
import { SUPABASE_PROPERTIES_TABLE } from '@scripts/consts';
import { compactDeep } from '@scripts/utils';
import { updateActualProperties } from './lib/updateActualProperties';

// fetch('/.netlify/functions/addProperty', {
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

	const input = extractSchemaFromJson(zPropertyFormData, event.body);
	if (!input) return response(400, 'Bad request');

	const { id, ...property } = input;

	const compactDB = compactDeep(property);
	if (!compactDB) return response(400, 'Bad request');

	const { data, error } = id
		? await writeSupabase.from(SUPABASE_PROPERTIES_TABLE).update(compactDB).eq('id', id).select().single()
		: await writeSupabase.from(SUPABASE_PROPERTIES_TABLE).insert(compactDB).select().single();

	if (error) {
		console.error(error);
		return response(500, error.message);
	} else {
		await updateActualProperties(data);
	}

	return response(200, { success: true });
}

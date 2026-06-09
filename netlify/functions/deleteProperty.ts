import type { Handler, HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { authMiddleware } from './lib/authMiddleware';
import { writeSupabase } from './lib/writeSupabase';
import { extractSchemaFromJson, zDeletePropertyInput, zUpdatePropertiesShowInput } from '@scripts/zod';
import { SUPABASE_PROPERTIES_TABLE } from '@scripts/consts';
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
	return await authMiddleware('super_admin', processHandler, event, context);
};

async function processHandler(event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
	if (!event.body) return response(400, 'Bad request');

	if (!writeSupabase) return response(500, 'writeDB invalid');

	console.log(event.body);
	const input = extractSchemaFromJson(zDeletePropertyInput, event.body);
	if (!input) return response(400, 'Bad request');

	const { error } = await writeSupabase.from(SUPABASE_PROPERTIES_TABLE).delete().eq('id', input.id);
	if (error) {
		console.error(error);
		return response(500, error.message);
	}

	return response(200, { success: true });
}

import type { Handler, HandlerResponse } from '@netlify/functions';
import { getMe } from './lib/authMiddleware';
import type { UserInfo } from '@scripts/zod';

// fetch('/.netlify/functions/getMe', {
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
	if (!event) return response(400, 'Bad request');

	const { payload, errResponse } = getMe(event, context);
	if (errResponse) return errResponse;

	if (!payload) return response(400, 'Bad request');

	const user: UserInfo = { role: payload.role };

	return response(200, user);
};

import type { HandlerContext, HandlerEvent, HandlerResponse } from '@netlify/functions';
import { parse } from 'cookie';
import type { UserRole } from '@scripts/zod';
import { verifyToken, type JwtPayload } from './auth';

function response(resCode: number, resObject: Object): HandlerResponse {
	if (resCode >= 400) console.error(resCode + ': ' + resObject);
	return {
		body: JSON.stringify(resObject),
		statusCode: resCode,
	};
}

function canProcess(userRole: UserRole, needRole: UserRole): boolean {
	switch (needRole) {
		case 'developer':
			if (userRole === 'developer') return true;
			else return false;
		case 'admin':
			if (userRole === 'developer' || userRole === 'admin') return true;
			else return false;
		default:
			return true;
	}
}

type Me = {
	payload: JwtPayload | undefined;
	errResponse: HandlerResponse | undefined;
};
export function getMe(event: HandlerEvent, context: HandlerContext): Me {
	const me: Me = { payload: undefined, errResponse: undefined };

	if (!event) return { ...me, errResponse: response(400, 'Bad request') };

	try {
		const cookies = parse(event.headers.cookie || '');
		const token = cookies.session;

		if (!token) return { ...me, errResponse: response(401, 'Unauthorized') };

		return { ...me, payload: verifyToken(token) };
	} catch (err) {
		return { ...me, errResponse: response(401, 'Invalid token') };
	}
}

export async function authMiddleware(
	needRole: UserRole,
	processHandler: (event: HandlerEvent, context: HandlerContext) => Promise<HandlerResponse>,
	event: HandlerEvent,
	context: HandlerContext,
) {
	if (!event || !event.body) return response(400, 'Bad request');

	const { payload, errResponse } = getMe(event, context);
	if (errResponse) return errResponse;

	if (!payload) return response(400, 'Bad request');

	if (canProcess(payload.role, needRole)) return await processHandler(event, context);
	return response(403, 'Forbidden');
}

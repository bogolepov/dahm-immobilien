import { serialize } from 'cookie';
import { extractSchemaFromJson, zLoginInput, type UserInfo, type UserRole } from '@scripts/zod';
import { createToken, JWT_EXPIRES_IN__NUMBER } from './lib/auth';
import type { Handler, HandlerResponse } from '@netlify/functions';

function response(resCode: number, resObject: Object): HandlerResponse {
	if (resCode >= 400) console.error(resCode + ': ' + resObject);
	return {
		body: JSON.stringify(resObject),
		statusCode: resCode,
	};
}

function userLogin(role: UserRole) {
	console.log('  userLogin1');
	const token = createToken({ role });
	console.log('  userLogin2');

	const cookie = serialize('session', token, {
		httpOnly: true,
		secure: process.env.MODE === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: JWT_EXPIRES_IN__NUMBER,
	});

	console.log('  userLogin3');
	const user: UserInfo = { role };
	console.log('  userLogin4');

	return {
		statusCode: 200,
		headers: {
			'Set-Cookie': cookie,
		},

		body: JSON.stringify(user),
	};
}

export const handler: Handler = async (event, context) => {
	if (!event || !event.body) return response(400, 'Bad request');

	const input = extractSchemaFromJson(zLoginInput, event.body);
	if (!input) return response(400, 'Bad request');

	console.log(input);

	if (input.email?.length) return response(400, 'Bad request');

	console.log('DEVELOPER:', process.env.DEVELOPER_LOGIN);
	if (input.login !== process.env.DEVELOPER_LOGIN) console.log('login not from Developer');
	if (input.password !== process.env.DEVELOPER_PASSWORD) console.log('password not from Developer');

	console.log('login1');
	if (input.login === process.env.ADMIN_LOGIN && input.password === process.env.ADMIN_PASSWORD) return userLogin('admin');
	console.log('login2');
	if (input.login === process.env.MODERATOR_LOGIN && input.password === process.env.MODERATOR_PASSWORD) return userLogin('moderator');
	console.log('login3');
	if (input.login === process.env.DEVELOPER_LOGIN && input.password === process.env.DEVELOPER_PASSWORD) return userLogin('developer');
	console.log('login4');

	return response(401, 'Invalid credentials');
};

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
	const token = createToken({ role });

	const cookie = serialize('session', token, {
		httpOnly: true,
		secure: process.env.MODE === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: JWT_EXPIRES_IN__NUMBER,
	});

	const user: UserInfo = { role };

	return {
		statusCode: 200,
		headers: {
			'Set-Cookie': cookie,
		},

		body: JSON.stringify(user),
	};
}

export const handler = async () => {
	return {
		statusCode: 200,
		body: JSON.stringify({
			envKeys: Object.keys(process.env).slice(0, 30),

			supabase: process.env.SUPABASE_URL,

			site: process.env.SITE_ID,
		}),
	};
};

// export const handler: Handler = async (event, context) => {
// 	if (!event || !event.body) return response(400, 'Bad request');

// 	const input = extractSchemaFromJson(zLoginInput, event.body);
// 	if (!input) return response(400, 'Bad request');

// 	console.log(input);

// 	if (input.email?.length) return response(400, 'Bad request');

// 	// console.log('ADMIN:', process.env.ADMIN_LOGIN);
// 	// console.log('MODERATOR:', process.env.MODERATOR_LOGIN);
// 	console.log('DEVELOPER:', process.env.DEVELOPER_LOGIN);
// 	if (input.login !== process.env.DEVELOPER_LOGIN) console.log('login not from Developer');
// 	if (input.password !== process.env.DEVELOPER_PASSWORD) console.log('password not from Developer');

// 	if (input.login === process.env.ADMIN_LOGIN && input.password === process.env.ADMIN_PASSWORD) return userLogin('admin');
// 	if (input.login === process.env.MODERATOR_LOGIN && input.password === process.env.MODERATOR_PASSWORD) return userLogin('moderator');
// 	if (input.login === process.env.DEVELOPER_LOGIN && input.password === process.env.DEVELOPER_PASSWORD) return userLogin('developer');

// 	return response(401, 'Invalid credentials');
// };

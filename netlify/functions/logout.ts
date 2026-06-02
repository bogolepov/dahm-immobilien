import type { Handler } from '@netlify/functions';
import { serialize } from 'cookie';

export const handler: Handler = async () => {
	const cookie = serialize('session', '', {
		httpOnly: true,
		secure: process.env.MODE === 'production',
		sameSite: 'lax',
		path: '/',
		expires: new Date(0),
	});

	return {
		statusCode: 200,
		headers: {
			'Set-Cookie': cookie,
		},
		body: JSON.stringify({}),
	};
};

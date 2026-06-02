import type { UserRole } from '@scripts/zod';
import jwt from 'jsonwebtoken';

export const JWT_EXPIRES_IN__TEXT = '8h';
export const JWT_EXPIRES_IN__NUMBER = 8 * 60 * 60; // in seconds!

export interface JwtPayload {
	role: UserRole;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export function createToken(payload: JwtPayload) {
	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN__TEXT,
	});
}

export function verifyToken(token: string) {
	return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

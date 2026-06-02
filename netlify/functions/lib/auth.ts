import type { UserRole } from '@scripts/zod';
import jwt from 'jsonwebtoken';
import dahm from '@data/dahm.json';

export const JWT_EXPIRES_IN__TEXT = '8h';
export const JWT_EXPIRES_IN__NUMBER = 8 * 60 * 60; // in seconds!

export interface JwtPayload {
	role: UserRole;
}

const JwtOptions: jwt.SignOptions = {
	algorithm: 'ES256' as const,
	issuer: dahm.domain,
	audience: dahm.domain,
};

export function createToken(payload: JwtPayload) {
	return jwt.sign(payload, process.env.JWT_ACCESS_PRIVATE_KEY as jwt.Secret, {
		...JwtOptions,
		expiresIn: JWT_EXPIRES_IN__TEXT,
	});
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, process.env.JWT_ACCESS_PUBLIC_KEY as jwt.Secret) as JwtPayload;
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) return undefined;
		throw error;
	}
}

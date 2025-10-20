import { getRequestEvent } from '$app/server';
import { redirect } from '@sveltejs/kit';
import { db } from './server/db';
import { sessions } from './server/db/schema';
import { eq } from 'drizzle-orm';

export function sha_256(str: string) {
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	return crypto.subtle.digest('SHA-256', data);
}

export function equal(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	let c = 0;
	for (let i = 0; i < a.byteLength; i++) {
		c |= a[i] ^ b[i];
	}
	return c === 0;
}

export async function check_auth() {
	const event = getRequestEvent();
	const [session, secret] = event.cookies.get('user')?.split('.') ?? [];
	if (!session) {
		redirect(302, '/login');
	}
	const session_record = await db.select().from(sessions).where(eq(sessions.id, session)).get();
	if (
		!session_record?.secret ||
		!equal(new Uint8Array(session_record?.secret), new Uint8Array(await sha_256(secret)))
	) {
		event.cookies.set('user', '', {
			expires: new Date(0),
			path: '/',
		});
		redirect(302, '/login');
	}
	return session_record;
}

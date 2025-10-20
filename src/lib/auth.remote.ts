import { form, getRequestEvent } from '$app/server';
import * as v from 'valibot';
import { db } from './server/db';
import { passwords, sessions } from './server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { check_auth, sha_256 } from './utils';

export const login = form(
	v.object({
		password: v.string(),
	}),
	async ({ password }, invalid) => {
		const hashed = await sha_256(password);
		const allowed = await db.select().from(passwords).where(eq(passwords.hash, hashed)).get();
		if (allowed) {
			const event = getRequestEvent();
			const secret = crypto.randomUUID();
			const hashed_secret = await sha_256(secret);
			const [session] = await db
				.insert(sessions)
				.values({
					secret: hashed_secret,
				})
				.returning();
			if (!session) {
				return invalid('Could not create session');
			}
			event.cookies.set('user', session.id + '.' + secret, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 365, // one year expiration
			});
			redirect(302, '/admin');
		}
	},
);

export const add_password = form(
	v.object({
		password: v.pipe(v.string(), v.minLength(8)),
	}),
	async ({ password }, invalid) => {
		await check_auth();
		try {
			await db.insert(passwords).values({
				hash: await sha_256(password),
			});
		} catch {
			invalid("Can't add a new password");
		}
	},
);

export const logout = form(async () => {
	const session = await check_auth();
	try {
		await db.delete(sessions).where(eq(sessions.id, session.id));
		const event = getRequestEvent();
		event.cookies.set('user', '', {
			expires: new Date(0),
			path: '/',
		});
		redirect(302, '/login');
	} catch (e) {
		console.log(e);
		/** */
	}
});

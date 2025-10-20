import { form, query } from '$app/server';
import { db } from '$lib/server/db';
import { photos } from '$lib/server/db/schema';
import { utapi } from '$lib/server/uploadthing';
import { redirect } from '@sveltejs/kit';
import { count, eq, isNotNull } from 'drizzle-orm';
import * as v from 'valibot';
import { upload_file } from './server/uploadthing/upload-file.js';
import { check_auth } from './utils';

const page_size = 10;

export const get_pages = query(async () => {
	const photos_num = await db.select({ value: count() }).from(photos).get();
	return Math.ceil((photos_num?.value ?? 0) / page_size);
});

export const get_photos = query(v.number(), async (page) => {
	const page_photos = await db
		.select()
		.from(photos)
		.where(isNotNull(photos.title))
		.limit(page_size)
		.offset(page * page_size);
	return page_photos;
});

export const get_all_photos = query(async () => {
	await check_auth();
	const page_photos = await db.select().from(photos);
	return page_photos;
});

export const get_photo = query(
	v.object({ id: v.string(), edit: v.optional(v.boolean()) }),
	async ({ id, edit = false }) => {
		const photo = await db.select().from(photos).where(eq(photos.id, id)).get();
		if (photo == null || (!edit && photo.title == null)) {
			redirect(302, '/');
		}
		return photo;
	},
);

export const delete_photo = form(
	v.object({ id: v.string(), key: v.string() }),
	async ({ id, key }, invalid) => {
		await check_auth();
		try {
			await db.delete(photos).where(eq(photos.id, id));
		} catch {
			invalid('Impossibile cancellare la foto');
		}
		try {
			await utapi.deleteFiles([key]);
		} catch {
			/** */
		}
	},
);

export const edit_photo = form(
	v.object({
		id: v.string(),
		title: v.string(),
		description: v.optional(v.string()),
	}),
	async ({ id, description, title }, invalid) => {
		try {
			await db
				.update(photos)
				.set({
					title,
					description,
				})
				.where(eq(photos.id, id));
		} catch {
			return invalid('Impossibile modificare la foto');
		}
		redirect(302, '/admin');
	},
);

export const upload_photo = form(
	v.object({ file: v.file(), title: v.string(), description: v.optional(v.string()) }),
	async ({ file, description, title }, invalid) => {
		try {
			await upload_file(file, title, description);
		} catch (e) {
			return invalid((e as Error).message);
		}
	},
);

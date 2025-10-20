import { form, query } from '$app/server';
import * as v from 'valibot';
import sharp from 'sharp';
import { utapi } from '$lib/server/uploadthing';
import { db } from '$lib/server/db';
import { photos } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { check_auth } from './utils';

const page_size = 10;

export const get_photos = query(v.number(), async (page) => {
	const page_photos = await db
		.select()
		.from(photos)
		.limit(page_size)
		.offset(page * page_size);
	return page_photos;
});

export const get_all_photos = query(async () => {
	await check_auth();
	const page_photos = await db.select().from(photos);
	return page_photos;
});

export const get_photo = query(v.string(), async (id) => {
	const photo = await db.select().from(photos).where(eq(photos.id, id)).get();
	if (!photo) {
		redirect(302, '/');
	}
	return photo;
});

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
	v.object({ id: v.string(), title: v.string(), description: v.optional(v.string()) }),
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
		// Handle the uploaded file here
		const meta = await sharp(await file.bytes()).metadata();

		if (!meta.width || !meta.height) {
			return invalid.file('Impossibile recuperare dimensioni della foto');
		}

		const ret = await utapi.uploadFiles([file]);

		if (ret[0].error) {
			return invalid.file('Uploading error: ' + ret[0].error.message);
		}

		const url = ret[0].data.ufsUrl;

		try {
			await db.insert(photos).values({
				width: meta.width ?? 0,
				height: meta.height ?? 0,
				title,
				url,
				description,
				key: ret[0].data.key,
			});
		} catch {
			return invalid('Impossibile salvare la foto');
		}
	},
);

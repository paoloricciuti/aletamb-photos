import imageSize from 'image-size';
import { utapi } from './index.js';
import { db } from '../db/index.js';
import { photos } from '../db/schema.js';

export async function upload_file(file: File, title?: string, description?: string) {
	// Handle the uploaded file here
	const meta = imageSize(await file.bytes());

	if (!meta.width || !meta.height) {
		throw new Error('Impossibile recuperare dimensioni della foto');
	}

	const ret = await utapi.uploadFiles([file]);

	if (ret[0].error) {
		throw new Error('Uploading error: ' + ret[0].error.message);
	}

	const url = ret[0].data.ufsUrl;

	try {
		return await db
			.insert(photos)
			.values({
				width: meta.width ?? 0,
				height: meta.height ?? 0,
				title,
				url,
				description,
				key: ret[0].data.key,
			})
			.returning()
			.then(([photo]) => photo);
	} catch {
		throw new Error('Impossibile salvare la foto');
	}
}

import { upload_file } from '$lib/server/uploadthing/upload-file.js';
import { check_auth } from '$lib/utils.js';
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
	await check_auth();
	const form_data = await request.formData();
	const file = form_data.get('photo[]');

	if (file instanceof File === false) {
		return new Response('File non valido', { status: 400 });
	}

	try {
		const uploaded_file = await upload_file(file);
		redirect(302, `/admin/edit/${uploaded_file.id}`);
	} catch (e) {
		return new Response((e as Error).message, { status: 500 });
	}
}

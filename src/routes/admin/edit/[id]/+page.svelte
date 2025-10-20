<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { edit_photo, get_photo } from '$lib/photos.remote.js';
	import { untrack } from 'svelte';

	let { params } = $props();

	const photo = $derived(await get_photo({ id: params.id, edit: true }));

	function set_values() {
		edit_photo.fields.title.set(photo.title ?? '');
		edit_photo.fields.description.set(photo.description ?? '');
	}

	if (!browser) {
		set_values();
	}

	$effect.pre(() => {
		void params.id;
		untrack(() => {
			set_values();
		});
	});
</script>

<h1>Modifica foto</h1>

<form {...edit_photo} enctype="multipart/form-data">
	<img
		src={photo.url}
		style="view-transition-name: img-{photo.id}"
		alt={'description' in photo ? photo.description : 'No description yet'}
	/>
	<input {...edit_photo.fields.id.as('hidden', photo.id)} />
	<label>
		Titolo
		<Input {...edit_photo.fields.title.as('text')} />
	</label>
	<label>
		Descrizione
		<Input {...edit_photo.fields.description.as('text')} />
	</label>
	<Button disabled={edit_photo.pending > 0}>Modifica foto</Button>
</form>

<style>
	img {
		height: 18.75rem;
	}
	form {
		display: grid;
		gap: 2rem;
		max-width: 40rem;
		margin: auto;
	}
</style>

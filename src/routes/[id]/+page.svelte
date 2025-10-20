<script lang="ts">
	import Polaroid from '$lib/components/Polaroid.svelte';
	import { get_photo } from '$lib/photos.remote.js';
	import type { Photo } from '$lib/server/db/schema.js';

	let { params } = $props();

	let photo = $derived((await get_photo({ id: params.id, admin: false })) as Photo);
</script>

<main>
	<Polaroid
		full
		id={photo.id}
		src={photo.url}
		alt={photo.description ?? 'Photo'}
		width={photo.width}
		height={photo.height}
	/>
</main>
<h2>{photo.title}</h2>
<p>{photo.description}</p>

<style>
	main {
		display: grid;
		position: relative;
		justify-items: center;
		height: 70vh;
	}
	h2,
	p {
		text-align: center;
		margin: 0;
	}
</style>

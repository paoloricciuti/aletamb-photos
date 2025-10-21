<script lang="ts">
	import Polaroid from '$lib/components/Polaroid.svelte';
	import { get_photo } from '$lib/photos.remote.js';
	import { create_remote_and_notify } from '$lib/remote-notify.js';

	let { params } = $props();

	const fn = create_remote_and_notify();

	let photo = $derived(await fn(get_photo({ id: params.id })));
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

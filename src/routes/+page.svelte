<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Polaroid from '$lib/components/Polaroid.svelte';
	import { get_photos } from '$lib/photos.remote.js';
</script>

<main>
	{#each await get_photos(+(page.url.searchParams.get('page') ?? '0')) as photo (photo.id)}
		<a href={resolve('/[id]', { id: photo.id })}>
			<Polaroid
				id={photo.id}
				src={photo.url}
				alt={photo.description ?? 'Photo'}
				width={photo.width}
				height={photo.height}
			/>
		</a>
	{/each}
</main>

<style>
	main {
		display: grid;
		padding: 2.5rem;
		gap: 5rem;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		& > * {
			display: grid;
			place-items: center;
		}
	}
</style>

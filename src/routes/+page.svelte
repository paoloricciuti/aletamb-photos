<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Polaroid from '$lib/components/Polaroid.svelte';
	import { get_pages, get_photos } from '$lib/photos.remote.js';

	const page_num = $derived(+(page.url.searchParams.get('page') ?? '0'));
</script>

<ul>
	{#each await get_photos(page_num) as photo (photo.id)}
		<li>
			<a class="photos" href={resolve('/[id]', { id: photo.id })}>
				<Polaroid
					id={photo.id}
					src={photo.url}
					alt={photo.description ?? 'Photo'}
					width={photo.width}
					height={photo.height}
				/>
			</a>
		</li>
	{/each}
</ul>

<footer>
	{#if page_num > 0}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="prev" href="/?page={page_num - 1}" title="Pagina precedente"
			><svg height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><path
					fill="none"
					stroke="#111"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M18 12H3m3-3l-3 3l3 3m15-6l-3 3l3 3"
				/></svg
			></a
		>
	{/if}

	<span class="current">Pagina {page_num + 1} di {await get_pages()}</span>

	{#if page_num + 1 < (await get_pages())}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="next" href="/?page={page_num + 1}" title="Pagina successiva"
			><svg height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><path
					fill="none"
					stroke="#111"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="m18 15l3-3l-3-3M3 15l3-3l-3-3m3 3h15"
				/></svg
			></a
		>
	{/if}
</footer>

<style>
	ul {
		display: grid;
		padding: 2.5rem;
		gap: 5rem;
		grid-template-columns: repeat(auto-fit, minmax(min(400px, 90%), 1fr));
		& > * {
			display: grid;
			place-items: center;
		}
		.photos {
			display: grid;
		}
	}
	footer {
		margin-top: auto;
		display: grid;
		grid-template-columns: 10% 1fr 10%;
		gap: 2rem;
		place-items: center;
		.prev {
			grid-column: 1;
		}
		.current {
			grid-column: 2;
		}
		.next {
			grid-column: 3;
		}
	}
</style>

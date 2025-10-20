<script lang="ts">
	import '@fontsource/cedarville-cursive';
	import { onNavigate } from '$app/navigation';
	import favicon from '$lib/assets/aletamb.png';
	import '../app.css';
	import { resolve } from '$app/paths';
	let { children } = $props();

	onNavigate(({ complete }) => {
		return new Promise((res) => {
			document.startViewTransition(async () => {
				res();
				await complete;
				await new Promise((res) => setTimeout(res, 300)); // TODO fix this when fixed in sveltekit
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>aletamb photos</title>
</svelte:head>

<header>
	<a title="Home" href={resolve('/')}
		><svg height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
			><g fill="none" stroke="#111" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
				><path d="M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /><path
					d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"
				/></g
			></svg
		></a
	>
	<h1>aletamb photos</h1>
	<a title="Home" href={resolve('/admin')}
		><svg height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
			><path
				fill="none"
				stroke="#111"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0-8 0M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"
			/></svg
		></a
	>
</header>
{@render children?.()}

<style>
	header {
		display: grid;
		grid-template-columns: min-content 1fr min-content;
		place-items: center;
	}
	h1 {
		text-align: center;
		font-size: 3rem;
		margin: 0;
	}
</style>

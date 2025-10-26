<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/aletamb.png';
	import logo from '$lib/assets/aletamb.svg';
	import '@fontsource/cedarville-cursive';
	import '../app.css';

	let { children } = $props();

	onNavigate(({ complete }) => {
		return new Promise((res) => {
			document.startViewTransition(async () => {
				res();
				await complete;
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
		><img style:height="48px" src={logo} alt="aletamb photos logo" /></a
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

<script lang="ts" generics="TInput extends RemoteFormInput, TOutput">
	import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';

	let { form }: { form: RemoteForm<TInput, TOutput> } = $props();
</script>

<ul>
	<!-- eslint-disable-next-line svelte/require-each-key -->
	{#each (form as unknown as RemoteForm<{ just_to_make_ts_shutup: string }, TOutput>).fields.allIssues() as error}
		<li>{error.message}</li>
	{/each}
</ul>

<style>
	ul {
		padding: 0;
		margin: 0;
		list-style: none;
		li {
			color: red;
			font-family: monospace;
		}
	}
</style>

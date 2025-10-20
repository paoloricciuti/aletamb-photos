<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	const props: HTMLInputAttributes = $props();
</script>

<input {...props} />

<style>
	input {
		all: unset;
		background-color: var(--bg-dark);
		border: 1px solid var(--accent);
		padding: 0.5rem 1rem;
		rotate: -1deg;
		&[type='file'] {
			background-color: transparent;
			border: 0;
			&::file-selector-button {
				all: unset;
				background-color: var(--accent);
				padding: 0.5rem 1.5rem;
				rotate: 1.5deg;
				margin-right: 2rem;
			}
		}
	}
</style>

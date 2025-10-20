<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const { children, ...props }: HTMLButtonAttributes = $props();
</script>

<button {...props}>{@render children?.()}</button>

<style>
	button {
		all: unset;
		background-color: var(--accent);
		padding: 0.5rem 1.5rem;
		rotate: 0.5deg;
		&:disabled {
			opacity: 0.5;
		}
	}
</style>

<script lang="ts">
	let {
		id,
		src,
		alt = 'Polaroid photo',
		width,
		height,
		full = false,
	}: {
		id: string;
		src: string;
		alt: string;
		width: number;
		height: number;
		full?: boolean;
	} = $props();

	let aspect_ratio = $state(width / height);

	// Generate a consistent hash from the URL to create a deterministic rotation
	function hash_string(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash);
	}

	// Generate rotation angle between -4 and 4 degrees based on URL
	const hash = $derived(hash_string(src));
	const rotation = $derived((hash % 800) / 100 - 4); // Range: -4 to 4 degrees with better distribution
</script>

<div
	class={['polaroid', { full }]}
	style:--rotation="{rotation}deg"
	style:--aspect-ratio={aspect_ratio}
	style="view-transition-name: polaroid-{id};"
>
	<div class="tape tape-top-left"></div>
	<div class="tape tape-bottom-right"></div>
	<div class="photo-container">
		<img {src} {alt} />
	</div>
</div>

<style>
	.polaroid {
		position: relative;
		width: min(300px, 90%);
		aspect-ratio: var(--aspect-ratio);
		background: white;
		padding: 1rem 1rem 3rem 1rem;
		rotate: var(--rotation);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	}
	.full {
		margin: auto;
		position: absolute;
		width: unset;
		rotate: 0deg;
		max-height: 90%;
	}

	.photo-container {
		width: 100%;
		overflow: hidden;
		background: #f0f0f0;
	}

	.photo-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.tape {
		position: absolute;
		width: 5rem;
		height: 1.875rem;
		background: rgba(255, 248, 220, 0.6);
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 10;
	}

	.tape-top-left {
		top: 0.25rem;
		left: -1.75rem;
		transform: rotate(-45deg);
	}

	.tape-bottom-right {
		bottom: -0.25rem;
		right: -1.25rem;
		transform: rotate(-45deg);
	}
</style>

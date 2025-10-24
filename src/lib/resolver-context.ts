import { createContext, settled } from 'svelte';

const [get_resolver, set_resolver] = createContext<{
	resolver: (settled: () => Promise<void>) => void;
}>();

export { get_resolver, set_resolver };

export function wait_settled() {
	const { resolver } = get_resolver();
	resolver(settled);
}

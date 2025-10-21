import { createContext } from 'svelte';

const [get_resolver, set_resolver] = createContext<{
	should_wait: () => void;
	resolver: () => void;
}>();

export { get_resolver, set_resolver };

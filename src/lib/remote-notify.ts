import { tick } from 'svelte';
import { get_resolver } from './resolver-context';

export function create_remote_and_notify() {
	const resolver = get_resolver();
	resolver.should_wait();
	let awaited = 0;
	return async <T>(fn: Promise<T>) => {
		awaited++;
		const val = await fn;
		awaited--;
		tick().then(() => {
			if (awaited === 0) {
				resolver.resolver();
			}
		});
		return val;
	};
}

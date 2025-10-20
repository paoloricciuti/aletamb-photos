import { check_auth } from '$lib/utils';

const authed_routes = [/\/admin(\/.*)?$/i];

export async function handle({ resolve, event }) {
	if (authed_routes.some((authed_route) => !!event.route.id?.match(authed_route))) {
		await check_auth();
	}
	return resolve(event);
}

import { error } from '@sveltejs/kit';
import { accessToken } from '$lib/stores';

export function load() {
	if (!accessToken) {
		return error(404, 'Not found');
	}
}

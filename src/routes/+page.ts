import { redirect } from '@sveltejs/kit';
import { AccessToken } from '$lib/storage';

export async function load() {
	if (!AccessToken.exists()) {
		throw redirect(302, '/login');
	} else {
		throw redirect(302, '/history');
	}
}

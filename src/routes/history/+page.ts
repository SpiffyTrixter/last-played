import { redirect } from '@sveltejs/kit';
import { cookieExists } from '$lib/cookie';

export async function load() {
	if (!cookieExists('access_token')) {
		throw redirect(302, '/');
	}
}

import { redirect } from '@sveltejs/kit';
import { removeCookie } from '$lib/cookie';

export async function load() {
	sessionStorage.clear();
	removeCookie('access_token');

	throw redirect(302, '/');
}

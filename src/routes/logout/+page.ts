import { redirect } from '@sveltejs/kit';

export async function load() {
	sessionStorage.removeItem('access_token');
	sessionStorage.removeItem('refresh_token');

	throw redirect(302, '/');
}

import { redirect } from '@sveltejs/kit';
import Cookies from 'js-cookie';

export async function load() {
	if (Cookies.get('access_token')) {
		throw redirect(302, '/history');
	} else {
		throw redirect(302, '/login');
	}
}

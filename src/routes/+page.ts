import { redirect } from '@sveltejs/kit';
import Cookies from 'js-cookie';

export async function load() {
	if (window.location.search.includes('code')) {
		throw redirect(302, '/callback?code=' + window.location.search.split('code=')[1].split('&')[0]);
	}

	if (Cookies.get('access_token')) {
		throw redirect(302, '/history');
	} else {
		throw redirect(302, '/login');
	}
}

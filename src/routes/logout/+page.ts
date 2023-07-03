import { redirect } from '@sveltejs/kit';
import Cookies from 'js-cookie';

export async function load() {
	sessionStorage.clear();
	localStorage.clear();
	Cookies.remove('access_token');
	Cookies.remove('selected_songs');

	throw redirect(302, '/');
}

import { redirect } from '@sveltejs/kit';
import { getLastPlayedSongs } from '$lib/spotify';
import { cookieExists, getCookie } from '$lib/cookie';

export async function load() {
	if (!cookieExists('access_token')) {
		throw redirect(302, '/');
	}

	const accessToken = getCookie('access_token');
	const lastPlayedSongs = await getLastPlayedSongs(accessToken);

	if (lastPlayedSongs.error) {
		console.error(lastPlayedSongs.error);
		throw redirect(302, '/');
	}

	return {
		accessToken,
		lastPlayedSongs
	};
}

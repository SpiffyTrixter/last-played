import { redirect } from '@sveltejs/kit';
import { getLastPlayedSongs } from '$lib/spotify';
import { AccessToken } from '$lib/storage';

export async function load() {
	if (!AccessToken.exists()) {
		throw redirect(302, '/');
	}

	const accessToken = AccessToken.get();
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

import { Spotify } from '$lib/spotify';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';

export async function load(event: PageLoadEvent) {
	const code = event.url.searchParams.get('code') || null;

	if (code) {
		await Spotify.setTokens(code);

		throw redirect(302, '/history');
	}

	throw error(404, 'Not found');
}

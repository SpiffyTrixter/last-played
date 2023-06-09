import { getTokenResponse } from '$lib/spotify';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoadEvent } from './$types';
import Cookies from 'js-cookie';

export async function load(event: PageLoadEvent) {
	const code = event.url.searchParams.get('code') || null;

	if (code) {
		const response = await getTokenResponse(code);

		if (response.error) {
			throw error(500, response.error_description);
		}

		if (response.access_token && response.refresh_token) {
			Cookies.set('access_token', response.access_token, response.expires_in);
			sessionStorage.setItem('refresh_token', response.refresh_token);

			throw redirect(302, '/history');
		}

		throw error(500, 'Incorrect response from Spotify');
	}

	throw redirect(302, '/');
}

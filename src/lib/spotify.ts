import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_CLIENT_SECRET,
	PUBLIC_SPOTIFY_REDIRECT_URI
} from '$env/static/public';
import { accessToken, refreshToken } from '$lib/stores';
import { error, redirect } from '@sveltejs/kit';

export const Spotify = {
	login() {
		const url = new URL('https://accounts.spotify.com/authorize');
		url.searchParams.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
		url.searchParams.append('response_type', 'code');
		url.searchParams.append('redirect_uri', PUBLIC_SPOTIFY_REDIRECT_URI);

		// window.location.href = decodeURIComponent(url.toString());

		throw redirect(307, decodeURIComponent(url.toString()));
	},

	async setTokens(code: string) {
		const authorization = btoa(`${PUBLIC_SPOTIFY_CLIENT_ID}:${PUBLIC_SPOTIFY_CLIENT_SECRET}`);

		const authenticationCode = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				Authorization: `Basic ${authorization}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: PUBLIC_SPOTIFY_REDIRECT_URI
			})
		});

		const response = await authenticationCode.json();

		if (!authenticationCode.ok) {
			throw error(authenticationCode.status, response.error_description);
		}

		accessToken.set(response.access_token);
		refreshToken.set(response.refresh_token);
	}
};

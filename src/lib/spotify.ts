import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_CLIENT_SECRET,
	PUBLIC_SPOTIFY_REDIRECT_URI,
	PUBLIC_SPOTIFY_SCOPES
} from '$env/static/public';

export async function getTokenResponse(code: string) {
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

	return await authenticationCode.json();
}

export function getAuthorizationUrl() {
	const url = new URL('https://accounts.spotify.com/authorize');
	url.searchParams.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('redirect_uri', PUBLIC_SPOTIFY_REDIRECT_URI);
	url.searchParams.append('scope', PUBLIC_SPOTIFY_SCOPES);

	return decodeURIComponent(url.toString());
}

export async function getLastPlayedSongs(accessToken: string) {
	const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return await response.json();
}

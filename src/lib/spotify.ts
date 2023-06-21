import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_CLIENT_SECRET,
	PUBLIC_SPOTIFY_REDIRECT_URI,
	PUBLIC_SPOTIFY_SCOPES
} from '$env/static/public';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

export async function getTokenResponse(code: string) {
	const codeVerifier = sessionStorage.getItem('code_verifier') || '';
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
			redirect_uri: PUBLIC_SPOTIFY_REDIRECT_URI,
			client_id: PUBLIC_SPOTIFY_CLIENT_ID,
			code_verifier: codeVerifier
		})
	});

	return await authenticationCode.json();
}

export function getAuthorizationUrl() {
	const state = generateRandomString(16);
	const url = new URL('https://accounts.spotify.com/authorize');
	const codeVerifier = generateRandomString(128);
	const codeChallenge = Base64.stringify(sha256(codeVerifier))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

	sessionStorage.setItem('code_verifier', codeVerifier);

	url.searchParams.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
	url.searchParams.append('response_type', 'code');
	url.searchParams.append('redirect_uri', PUBLIC_SPOTIFY_REDIRECT_URI);
	url.searchParams.append('scope', PUBLIC_SPOTIFY_SCOPES);
	url.searchParams.append('state', state);
	url.searchParams.append('code_challenge_method', 'S256');
	url.searchParams.append('code_challenge', codeChallenge);

	return decodeURIComponent(url.toString());
}

export async function getLastPlayedSongs(
	accessToken: string,
	limit = 50,
	after?: string,
	before?: string
) {
	const url = new URL('https://api.spotify.com/v1/me/player/recently-played');
	url.searchParams.append('limit', limit.toString());

	if (after) url.searchParams.append('after', after);
	if (before) url.searchParams.append('before', before);

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	return await response.json();
}

export function createPlaylist(
	accessToken: string,
	userId: string,
	name: string,
	description?: string
) {
	return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			description: description
		})
	});
}

export function addTracksToPlaylist(accessToken: string, playlistId: string, uris: string[]) {
	if (uris.length > 100) throw new Error('Too many tracks to add to playlist');

	return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			uris: uris
		})
	});
}

function generateRandomString(length: number) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

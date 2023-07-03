import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_CLIENT_SECRET,
	PUBLIC_SPOTIFY_REDIRECT_URI,
	PUBLIC_SPOTIFY_SCOPES
} from '$env/static/public';
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import type { Song } from '../types/Song';

export async function getTokenResponse(code: string) {
	const codeVerifier = localStorage.getItem('code_verifier') || '';
	const authorization = btoa(`${PUBLIC_SPOTIFY_CLIENT_ID}:${PUBLIC_SPOTIFY_CLIENT_SECRET}`);

	if (!codeVerifier) throw new Error('No code verifier found');

	const response = await fetch('https://accounts.spotify.com/api/token', {
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

	const json = await response.json();

	if (json.error) throw new Error(json.error.message);

	return json;
}

export function getAuthorizationUrl() {
	const state = generateRandomString(16);
	const url = new URL('https://accounts.spotify.com/authorize');
	const codeVerifier = generateRandomString(128);
	const codeChallenge = Base64.stringify(sha256(codeVerifier))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

	localStorage.setItem('code_verifier', codeVerifier);

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
	after?: number,
	before?: number
) {
	const url = new URL('https://api.spotify.com/v1/me/player/recently-played');
	url.searchParams.append('limit', limit.toString());

	if (after) url.searchParams.append('after', after.toString());
	if (before) url.searchParams.append('before', before.toString());

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const json = await response.json();

	if (json.error) throw new Error(json.error.message);

	return json;
}

export async function getUserProfile(accessToken: string) {
	const url = new URL('https://api.spotify.com/v1/me');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const json = await response.json();

	if (json.error) throw new Error(json.error.message);

	return json;
}

export async function createPlaylist(
	accessToken: string,
	userId: string,
	name: string,
	description?: string
) {
	const url = new URL(`https://api.spotify.com/v1/users/${userId}/playlists`);

	const response = await fetch(url, {
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

	const json = await response.json();

	if (json.error) throw new Error(json.error.message);

	return json;
}

export async function addTracksToPlaylist(accessToken: string, playlistId: string, uris: string[]) {
	if (uris.length > 100) throw new Error('Too many tracks to add to playlist');

	const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`);

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			uris: uris
		})
	});

	const json = await response.json();

	if (json.error) throw new Error(json.error.message);

	return json;
}

export async function generatePlaylist(
	accessToken: string,
	name: string,
	description?: string,
	songs?: Song[]
) {
	const user = await getUserProfile(accessToken);
	const playlist = await createPlaylist(accessToken, user.id, name, description);

	if (songs) {
		let offset = 0;
		while (offset < songs.length) {
			const uris = songs.slice(offset, offset + 100).map((song) => song.id);
			await addTracksToPlaylist(accessToken, playlist.id, uris);
			offset += 100;
		}
	}
}

function generateRandomString(length: number) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

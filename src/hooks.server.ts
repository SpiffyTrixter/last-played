import { SvelteKitAuth } from '@auth/sveltekit';
import SpotifyProvider from '@auth/core/providers/spotify';
import { env } from '$env/dynamic/private';

export const handle = SvelteKitAuth({
	providers: [SpotifyProvider({ clientId: env.SPOTIFY_CLIENT_ID, clientSecret: env.SPOTIFY_CLIENT_SECRET })]
});

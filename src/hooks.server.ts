import {SvelteKitAuth} from "@auth/sveltekit"
import SpotifyProvider from "@auth/core/providers/spotify"
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "$env/static/private";

export const handle = SvelteKitAuth({
    providers: [
        SpotifyProvider({ clientId: SPOTIFY_CLIENT_ID, clientSecret: SPOTIFY_CLIENT_SECRET }),
    ]
});
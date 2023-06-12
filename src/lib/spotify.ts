import { PUBLIC_SPOTIFY_CLIENT_ID, PUBLIC_SPOTIFY_CLIENT_SECRET, PUBLIC_SPOTIFY_REDIRECT_URI } from '$env/static/public'

export const Spotify = {
    token: null,

    async getAccessToken() {
        const code = new URL(window.location.href).searchParams.get('code');
        const authorization = btoa(`${PUBLIC_SPOTIFY_CLIENT_ID}:${PUBLIC_SPOTIFY_CLIENT_SECRET}`)

        if (code === null) {
            return null
        }

        const authenticationCode = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authorization}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: PUBLIC_SPOTIFY_REDIRECT_URI,
            }),
        })

        const { access_token } = await authenticationCode.json()

        return access_token
    },

    login() {
        const url = new URL('https://accounts.spotify.com/authorize')
        url.searchParams.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID)
        url.searchParams.append('response_type', 'code')
        url.searchParams.append('redirect_uri', PUBLIC_SPOTIFY_REDIRECT_URI)

        window.location.href = decodeURIComponent(url.toString());
    }
}
<script>
    import { Geolocation } from '@capacitor/geolocation';
    import { Spotify } from "$lib/spotify.ts";

    let loc = null;
    let code = null;

    async function getCurrentPosition(){
        loc = await Geolocation.getCurrentPosition()
    }

    async function getCode() {
        code = await Spotify.getAccessToken();
    }

    function spotifyAuth() {
        Spotify.login();
    }
</script>

<div>
    <h1>Geolocation</h1>
    <p>Your location is:</p>
    <p>Latitude: {loc?.coords.latitude}</p>
    <p>Longitude: {loc?.coords.longitude}</p>
    <p>Code: {code}</p>

    <button on:click={getCurrentPosition}>
        Get Current Location
    </button>

    <button on:click={getCode}>
        Get Access Token
    </button>

    <button on:click={spotifyAuth}>
        Get Code
    </button>
</div>

<style>
    div {
        padding-top: 50px;
    }
</style>
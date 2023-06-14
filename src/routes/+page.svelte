<script lang="ts">
    import { Spotify } from "$lib/spotify.ts";
</script>

<div>
    <button on:click={Spotify.login}>
        Login
    </button>
</div>
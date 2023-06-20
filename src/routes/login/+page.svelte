<script lang="ts">
    import { getAuthorizationUrl } from "$lib/spotify.ts";

    const authorizationUrl = getAuthorizationUrl();
</script>

<div>
    <a href="{authorizationUrl}">
        Login
    </a>
</div>
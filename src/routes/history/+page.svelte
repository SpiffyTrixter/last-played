<script lang="ts">
  import PageData = App.PageData;
  import type { LastPlayedSongs } from "../../types/LastPlayedSongs";

  export let data: PageData<{
    accessToken: string
    lastPlayedSongs: LastPlayedSongs
  }>;

</script>

<div>
  Authenticated as {data.accessToken}
  <br/>
  Last played songs: {data.lastPlayedSongs.next}
</div>
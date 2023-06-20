<script lang="ts">
  import PageData = App.PageData;

  export let data: PageData<{
    accessToken: string
    lastPlayedSongs: JSON
  }>;

</script>

<div>
  Authenticated as {data.accessToken}
  <br/>
  Last played songs: {data.lastPlayedSongs.next}
</div>
<script lang="ts">
  import PageData = App.PageData;
  import type { LastPlayedSongs } from "../../types/LastPlayedSongs";
  import { getLastPlayedSongs } from "$lib/spotify";
  import DateInput from "$lib/components/DateInput.svelte";

  export let data: PageData<{
    accessToken: string
    lastPlayedSongs: LastPlayedSongs
  }>;

  let {
    after,
    before
  } = data.lastPlayedSongs.cursors;
  let lastPlayedSongs = data.lastPlayedSongs;

  let afterDate = new Date(parseInt(after));
  let beforeDate = new Date(parseInt(before));
  let limit = 50;

  $: if (afterDate || beforeDate || limit) {
    after = afterDate.getTime().toString();
    before = beforeDate.getTime().toString();

    getLastPlayedSongs(
      data.accessToken,
      limit,
      after,
    ).then((songs) => {
      lastPlayedSongs = songs;
    }).catch((err) => {
      console.error(err);
    })
  }

</script>

<div>
  <div id="filter-container">
    After:
    <DateInput id="after" bind:date={afterDate} />
    Before:
    <DateInput id="before" bind:date={beforeDate} />
    Limit:
    <input type="number" id="limit" max="50" bind:value={limit}>
  </div>
  <div>
    {#each lastPlayedSongs.items as song}
      <div>
        {song.track.name} - {song.track.artists[0].name} - {song.played_at}
      </div>
    {/each}
  </div>
</div>
<script lang="ts">
  import { onMount } from "svelte";
  import type { Song } from "../../types/Song";
  import { addSong, isSongSelected, toggleSong } from "$lib/song";
  import { selectedSongs } from "$lib/stores";
  import AudioButton from "$lib/components/AudioButton.svelte";

  export let song: Song;

  let selected;

  onMount(() => {
    addSong(song);
  });

  selectedSongs.subscribe(() => {
    selected = isSongSelected(song);
  });
</script>


<div class="song" id="{song.id}" class:selected={selected}>
  {song.title} - {song.artists} - {song.played_at}
  <AudioButton src="{song.preview_url}" />
  <button on:click={() => toggleSong(song)}>
    {selected ? "Deselect" : "Select"}
  </button>
</div>

<style>
    .selected {
        background-color: green;
    }
</style>
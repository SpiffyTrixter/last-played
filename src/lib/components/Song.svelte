<script lang="ts">
  import { onMount } from "svelte";
  import type { Song } from "../../types/Song";
  import { addSong, isSongSelected, toggleSong } from "$lib/song";
  import { selectedSongs } from "$lib/stores";
  import AudioButton from "$lib/components/AudioButton.svelte";

  export let song: Song;

  let selected;
  let playedAt = new Date(song.played_at);
  let playedAtString = playedAt.toLocaleDateString("de-CH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  onMount(() => {
    addSong(song);
  });

  selectedSongs.subscribe(() => {
    selected = isSongSelected(song);
  });
</script>

<li
        id="{song.id}"
        class="song flex justify-between gap-x-6 p-5 rounded hover:bg-gray-200 transition-colors duration-150 ease-in-out"
        class:bg-gray-300={selected}
>
  <a href="#!" on:click={() => toggleSong(song)}>
    <div class="flex gap-x-4">
      <img class="h-12 w-12 flex-none rounded-full bg-gray-50" src="{song.image_url}" alt="">
      <div class="min-w-0 flex-auto">
        <p class="text-sm font-semibold leading-6 text-gray-900">{song.title}</p>
        <p class="mt-1 truncate text-xs leading-5 text-gray-500">{song.artists}</p>
      </div>
    </div>
  </a>

  <div class="hidden sm:flex sm:flex-col sm:items-end">
    <AudioButton src="{song.preview_url}" />
    <p class="text-sm leading-6 text-gray-900">{playedAtString}</p>
  </div>
</li>
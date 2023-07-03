<script lang="ts">
  import play from '$lib/assets/icons/play.svg';
  import pause from '$lib/assets/icons/pause.svg';

  export let src;

  let time = 0;
  let progress = 0;
  let duration = 0;
  let paused = true;

  $: progress = time / duration * 100;

  //if paused = false stop all other audio elements
</script>

<audio
  {src}
  bind:currentTime={time}
  bind:duration
  bind:paused
  on:ended={() => {
			time = 0;
		}}
></audio>

<button
  type="button"
  class="play text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  aria-label={paused ? 'play' : 'pause'}
  on:click={() => paused = !paused}
>
  {#if paused}
    <img src="{play}" alt="play">
    <span class="sr-only">Play</span>
  {:else}
    <img src="{pause}" alt="pause">
    <span class="sr-only">Pause</span>
  {/if}
</button>

<style>
  .audio-button {
    display: inline-block;
  }
</style>
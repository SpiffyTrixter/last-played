<script lang="ts">
  export let src;

  let time = 0;
  let duration = 0;
  let paused = true;
</script>

<div class="audio-button">
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
    class="play"
    aria-label={paused ? 'play' : 'pause'}
    on:click={() => paused = !paused}>
    {paused ? '▶️' : '⏸️'}
  </button>
</div>

<style>
  .audio-button {
    display: inline-block;
  }
</style>
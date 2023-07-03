<script context="module">
	const players = new Set();

	export function stopAll() {
		players.forEach((p) => p.pause());
	}
</script>

<script lang="ts">
	import play from '$lib/assets/icons/play.svg';
	import pause from '$lib/assets/icons/pause.svg';
	import { onMount } from 'svelte';

	export let src;

	let player;
	let time = 0;
	let duration = 0;
	let paused = true;

	onMount(() => {
		players.add(player);
	});

	function playPause() {
		stopAll();
		paused = !paused;
	}
</script>

<audio
	{src}
	bind:this={player}
	bind:currentTime={time}
	bind:duration
	bind:paused
	on:ended={() => {
		time = 0;
	}}
/>

<button
	type="button"
	class="play text-black bg-spotify hover:bg-spotify-hover font-medium rounded-full text-sm px-5 py-2.5 text-center z-50"
	aria-label={paused ? 'play' : 'pause'}
	on:click={playPause}
>
	{#if paused}
		<img src={play} alt="play" />
		<span class="sr-only">Play</span>
	{:else}
		<img src={pause} alt="pause" />
		<span class="sr-only">Pause</span>
	{/if}
</button>

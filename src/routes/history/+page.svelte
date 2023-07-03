<script lang="ts">
	import { generatePlaylist, getLastPlayedSongs } from '$lib/spotify';
	import { goto } from '$app/navigation';
	import { toggleAllSongs } from '$lib/song';
	import { selectedSongs } from '$lib/stores';
	import Swal from 'sweetalert2';
	import Cookies from 'js-cookie';
	import Song from '$lib/components/Song.svelte';
	import type { Song as SongInterface } from '../../types/Song';
	import Button from '$lib/components/Button.svelte';

	const accessToken = Cookies.get('access_token');

	if (!accessToken) {
		goto('/');
	}

	let limit = 50;
	let selected: SongInterface[] = [];
	let before = new Date().getTime();
	let playlistName =
		'Last Played ' +
		new Date().toLocaleDateString('de-CH') +
		' ' +
		new Date().toLocaleTimeString('de-CH');

	selectedSongs.set(JSON.parse(Cookies.get('selected_songs') || '[]'));
	selectedSongs.subscribe((songs) => {
		selected = songs;
		Cookies.set('selected_songs', JSON.stringify(songs), { expires: 86400 });
	});

	async function playlist() {
		if (!Cookies.get('access_token') || !accessToken) {
			await goto('/');
		} else {
			const { value: values } = await Swal.fire({
				template: '#swal-createPlaylist-template',
				confirmButtonColor: '#1DB954',
				preConfirm: () => {
					return [
						document.getElementById('swal-playlistName').value,
						document.getElementById('swal-playlistDescription').value
					];
				},
				didOpen: () => {
					document.getElementById('swal-playlistName').value = playlistName;
				}
			});

			if (!values) return;

			const [name, description] = values;

			if (!name) {
				Swal.fire({
					title: 'Name is required!',
					icon: 'error'
				});
				return;
			}

			generatePlaylist(accessToken, name, description, selected)
				.then(() => {
					Swal.fire({
						title: 'Playlist created!',
						icon: 'success'
					});
					Cookies.remove('selected_songs');
				})
				.catch((e) => {
					Swal.fire({
						title: e.message || 'Something went wrong!',
						icon: 'error'
					});
				});
		}
	}

	function convertToSong(lastPlayedSong): SongInterface {
		return {
			id: lastPlayedSong.track.uri,
			title: lastPlayedSong.track.name,
			artists: lastPlayedSong.track.artists.map((artist) => artist.name),
			image_url: lastPlayedSong.track.album.images[0].url,
			preview_url: lastPlayedSong.track.preview_url,
			played_at: lastPlayedSong.played_at
		};
	}
</script>

<div>
	<div class="w-full flex justify-between my-3">
		<h1
			class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl"
		>
			Last Played
		</h1>
		<button
			type="button"
			class="text-black bg-gray-400 hover:bg-gray-500 font-medium rounded-full text-sm px-5 py-2.5 text-center h-1/5"
			on:click={() => goto('/logout')}
		>
			Logout
		</button>
	</div>
	<div class="w-full flex justify-between my-3">
		<Button on:click={toggleAllSongs} text="Select All" />
		<Button on:click={playlist} text="Create Playlist" />
	</div>
	<div>
		<ul class="divide-y divide-gray-100">
			{#await getLastPlayedSongs(accessToken, limit, null, before)}
				<li class="text-center font-bold text-lg">
					<p>loading...</p>
				</li>
			{:then lastPlayedSongs}
				{#each lastPlayedSongs.items as lastPlayedSong}
					<Song song={convertToSong(lastPlayedSong)} />
				{/each}
			{:catch error}
				<li class="bg-red-500 text-center font-bold text-lg">
					<p>{error.message}</p>
				</li>
			{/await}
		</ul>
	</div>
	<div class="w-full flex justify-between my-3">
		<Button on:click={toggleAllSongs} text="Select All" />
		<Button on:click={playlist} text="Create Playlist" />
	</div>
</div>

<template id="swal-createPlaylist-template">
	<swal-title> Create Playlist </swal-title>
	<swal-html>
		<input style="width: 20rem" id="swal-playlistName" class="swal2-input" placeholder="Name" />
		<textarea
			style="width: 20rem"
			id="swal-playlistDescription"
			class="swal2-textarea"
			placeholder="Description"
		/>
	</swal-html>
	<swal-button type="cancel"> Cancel </swal-button>
	<swal-button type="confirm"> Confirm </swal-button>
</template>

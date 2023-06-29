<script lang="ts">
  import { addTracksToPlaylist, createPlaylist, getLastPlayedSongs, getUserProfile } from "$lib/spotify";
  import { cookieExists, getCookie, setCookie } from "$lib/cookie";
  import { goto } from "$app/navigation";

  checkLogin();

  const accessToken = getCookie('access_token');

  let limit = 50;
  // unix timestamp in milliseconds
  let before = new Date().getTime();
  let playlistName = 'Last Played ' + new Date().toLocaleDateString('de-CH') + ' ' + new Date().toLocaleTimeString('de-CH');
  let playlistDescription = '';
  let selectedSongs = getCookie('selected_songs')?.split(',') || [];

  function selectSong(song) {
    if (selectedSongs.includes(song.track.uri)) {
      selectedSongs = selectedSongs.filter((uri) => uri !== song.track.uri);
      document.getElementById(song.track.uri).classList.remove('selected');
    } else {
      selectedSongs.push(song.track.uri);
      document.getElementById(song.track.uri).classList.add('selected');
    }

    setCookie('selected_songs', selectedSongs.join(','), 86400);
  }

  async function playlist() {
    checkLogin();

    const total = selectedSongs.length;
    const user = await getUserProfile(accessToken);
    const playlist = await createPlaylist(accessToken, user.id, playlistName, playlistDescription);

    let offset = 0;
    while(offset < total) {
      const songs = selectedSongs.slice(offset, offset + 100);
      await addTracksToPlaylist(accessToken, playlist.id, songs)
      offset += 100;
    }

    alert('Playlist created');
    setCookie('selected_songs', '', 0);
  }

  function checkLogin() {
    if (!cookieExists('access_token')) {
      goto('/login')
    }
  }
</script>

<div>
  <button on:click={() => goto('/logout')}>Logout</button>
  <h1>Last Played</h1>
  <div>
    {#await getLastPlayedSongs(accessToken, limit, null, before)}
      <p>loading...</p>
    {:then songs}
      {songs.items.length}
      {#each songs.items as song}
        <div id="{song.track.uri}" class:selected={selectedSongs.includes(song.track.uri)}>
          {song.track.name} - {song.track.artists[0].name} - {song.played_at} <button on:click={() => selectSong(song)}>Select</button>
        </div>
      {/each}
    {:catch error}
      <p>{error.message}</p>
    {/await}
  </div>
  <div>
    <h2>Create Playlist</h2>
    <input bind:value={playlistName} />
    <input bind:value={playlistDescription} />
    <button on:click={playlist} >Save</button>
  </div>
</div>

<style>
  .selected {
    background-color: green;
  }
</style>
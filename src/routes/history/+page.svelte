<script lang="ts">
  import { generatePlaylist, getLastPlayedSongs, } from "$lib/spotify";
  import { goto } from "$app/navigation";
  import { deselectSong, toggleAllSongs } from "$lib/song";
  import { selectedSongs } from "$lib/stores";
  import Swal from 'sweetalert2';
  import Cookies from 'js-cookie';
  import Song from "$lib/components/Song.svelte";
  import type { Song as SongInterface } from "../../types/Song";

  const accessToken = Cookies.get('access_token');

  if (!accessToken) {
    goto('/')
  }

  let limit = 50;
  let selected: SongInterface[] = [];
  let before = new Date().getTime();
  let playlistName = 'Last Played ' + new Date().toLocaleDateString('de-CH') + ' ' + new Date().toLocaleTimeString('de-CH');
  let playlistDescription = '';

  selectedSongs.set(JSON.parse(Cookies.get('selected_songs') || '[]'));
  selectedSongs.subscribe((songs) => {
    selected = songs;
    Cookies.set('selected_songs', JSON.stringify(songs), { expires: 86400 });
  });

  async function playlist() {
    if (!Cookies.get('access_token') || !accessToken) {
      await goto('/')
    } else {
      const { value: values } = await Swal.fire({
        template: '#swal-createPlaylist-template',
        preConfirm: () => {
          return [
            document.getElementById('swal-playlistName').value,
            document.getElementById('swal-playlistDescription').value
          ]
        },
        didOpen: () => {
          document.getElementById('swal-playlistName').value = playlistName
        }
      })

      if (!values) return;

      const [name, description] = values;

      if (!name) {
        Swal.fire({
          title: 'Name is required!',
          icon: 'error'
        })
        return;
      }

      generatePlaylist(accessToken, name, description, selected).then(() => {
        Swal.fire({
          title: "Playlist created!",
          icon: "success"
        });
        Cookies.remove("selected_songs");
      }).catch((e) => {
        Swal.fire({
          title: e.message || 'Something went wrong!',
          icon: 'error'
        })
      })
    }
  }

  function convertToSong(lastPlayedSong): SongInterface {
    return {
      id: lastPlayedSong.track.uri,
      title: lastPlayedSong.track.name,
      artists: lastPlayedSong.track.artists.map((artist) => artist.name),
      preview_url: lastPlayedSong.track.preview_url,
      played_at: lastPlayedSong.played_at,
      selected: selected.includes(lastPlayedSong.track.id)
    };
  }
</script>

<div>
  <button on:click={() => goto('/logout')}>Logout</button>
  <h1>Last Played</h1>
  <div>
    {#await getLastPlayedSongs(accessToken, limit, null, before)}
      <p>loading...</p>
    {:then lastPlayedSongs}
      {lastPlayedSongs.items.length} - <button on:click={toggleAllSongs}>Select All</button>
      {#each lastPlayedSongs.items as lastPlayedSong}
        <Song song={convertToSong(lastPlayedSong)} />
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

<template id="swal-createPlaylist-template">
  <swal-title>
    Create Playlist
  </swal-title>
  <swal-html>
    <input id="swal-playlistName" class="swal2-input" placeholder="Name">
    <textarea id="swal-playlistDescription" class="swal2-textarea" placeholder="Description"></textarea>
    <h2>Selected</h2>
    {#if selected.length === 0}
      <p>No songs selected</p>
    {:else}
      <div style="text-align: left">
        {#each $selectedSongs as song}
          <div style="display: flex; justify-content: space-between">
            <span>{song.title}</span>
            <button class="preview" data-song-id="{song.id}">x</button>
          </div>
        {/each}
      </div>
    {/if}
  </swal-html>
  <swal-button type="confirm">
    Confirm
  </swal-button>
  <swal-button type="cancel">
    Cancel
  </swal-button>
</template>
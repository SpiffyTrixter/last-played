import { songs, selectedSongs } from '$lib/stores';
import type { Song } from '../types/Song';

export function addSong(song: Song) {
	songs.update((songs) => [...songs, song]);
}

export function deselectSong(song: Song) {
	console.log('deselecting song');
	selectedSongs.update((songs) => songs.filter((s) => s.id !== song.id));
}

export function toggleSong(song: Song) {
	selectedSongs.update((songs) => {
		if (isSongSelected(song)) {
			return songs.filter((s) => s.id !== song.id);
		} else {
			return [...songs, song];
		}
	});
}

export function isSongSelected(song: Song) {
	let selected = false;

	const unsubscribe = selectedSongs.subscribe((songs) => {
		selected = songs.some((s) => s.id === song.id);
	});

	unsubscribe();

	return selected;
}

export function toggleAllSongs() {
	let songsToToggle: Song[] = [];

	const unsubscribe = songs.subscribe((songs) => {
		songsToToggle = songs;
	});

	unsubscribe();

	selectedSongs.update((songs) => {
		if (songs.length === songsToToggle.length) {
			return [];
		} else {
			return songsToToggle;
		}
	});
}

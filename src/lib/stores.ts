import { writable } from 'svelte/store';
import type { Song } from '../types/Song';

export const songs = writable<Song[]>([]);
export const selectedSongs = writable<Song[]>([]);

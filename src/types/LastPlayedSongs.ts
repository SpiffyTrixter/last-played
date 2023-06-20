export interface LastPlayedSongs {
	href: string;
	limit: number;
	next: string;
	cursors: Cursors;
	total: number;
	items?: ItemsEntity[] | null;
}
export interface Cursors {
	after: string;
	before: string;
}
export interface ItemsEntity {
	track: Track;
	played_at: string;
	context: Context;
}
export interface Track {
	album: Album;
	artists?: ArtistsEntity[] | null;
	available_markets?: string[] | null;
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: ExternalIds;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	is_playable: boolean;
	linked_from: JSON;
	restrictions: Restrictions;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
	is_local: boolean;
}
export interface Album {
	album_type: string;
	total_tracks: number;
	available_markets?: string[] | null;
	external_urls: ExternalUrls;
	href: string;
	id: string;
	images?: ImagesEntity[] | null;
	name: string;
	release_date: string;
	release_date_precision: string;
	restrictions: Restrictions;
	type: string;
	uri: string;
	copyrights?: CopyrightsEntity[] | null;
	external_ids: ExternalIds;
	genres?: string[] | null;
	label: string;
	popularity: number;
	album_group: string;
	artists?: ArtistsEntity1[] | null;
}
export interface ExternalUrls {
	spotify: string;
}
export interface ImagesEntity {
	url: string;
	height: number;
	width: number;
}
export interface Restrictions {
	reason: string;
}
export interface CopyrightsEntity {
	text: string;
	type: string;
}
export interface ExternalIds {
	isrc: string;
	ean: string;
	upc: string;
}
export interface ArtistsEntity1 {
	external_urls: ExternalUrls;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}
export interface ArtistsEntity {
	external_urls: ExternalUrls;
	followers: Followers;
	genres?: string[] | null;
	href: string;
	id: string;
	images?: ImagesEntity[] | null;
	name: string;
	popularity: number;
	type: string;
	uri: string;
}
export interface Followers {
	href: string;
	total: number;
}
export interface Context {
	type: string;
	href: string;
	external_urls: ExternalUrls;
	uri: string;
}

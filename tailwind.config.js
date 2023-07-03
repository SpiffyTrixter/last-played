/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				spotify: '#1ed760',
				'spotify-hover': '#1db954',
			}
		}
	},
	plugins: []
};

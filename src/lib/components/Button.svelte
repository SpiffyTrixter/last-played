<script lang="ts">
	export let text = 'Hello world';
</script>

<button
	type="button"
	class="text-black bg-spotify hover:bg-spotify-hover font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2"
	on:click
>
	{text}
</button>

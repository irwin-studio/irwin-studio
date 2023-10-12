<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Canvas from '../canvas.svelte';
	import { onWheel } from '$lib/util/onWheel';

	const printLnClasses = `w-full text-white m-0 p-0 flex items-center text-wrap last:mb-auto`

	let cleanups: Array<() => void> = []
	let lines: string[] = []

	onMount(() => {
		const interval = setInterval(() => {
			lines = [...lines, Date.now().toString()];
		}, 500)

		cleanups.push(() => clearInterval(interval));
	});

	onDestroy(() => {
		cleanups.forEach(cb => cb())
	})
</script>

<!-- <svelte:window bind:innerHeight={height} bind:innerWidth={width} /> -->

<div class={`w-screen h-screen bg-slate-800 overflow-hidden flex flex-col justify-end`}>
	{#each lines as line}
			<pre class={printLnClasses}>{line}</pre>
	{/each}
</div>

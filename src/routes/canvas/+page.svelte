<script lang="ts">
	import { TreeApp } from '$lib/Application/myFirst';
	import { Engine } from '$lib/Engine';
	import { Renderer } from '$lib/Renderer';
	import type { ShapeTheme } from '$lib/Renderer/shape';
	import { onMount, onDestroy } from 'svelte';


	let renderer: Renderer;
	let engine: Engine;

	let canvas: HTMLCanvasElement;
	let width: number, height: number;
	let info: string = '';

	let interval: NodeJS.Timeout;

	onMount(() => {
		const application = new TreeApp()
		renderer = new Renderer(canvas);
		engine = new Engine(renderer, application)

		// center screen
		renderer.setScreenOffset([window.innerWidth / 2, window.innerHeight / 2]);

		interval = setInterval(() => {
				info = JSON.stringify(renderer.getInfo(), null, 4);
		}, 1000 / 20)

		engine.start()
	});

	onDestroy(() => {
		clearInterval(interval)
		engine?.stop()
	})
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="w-screen h-screen bg-blue-100">
	<canvas bind:this={canvas} {height} {width} />
	<div class="p-2 absolute top-0 left-0 h-96 w-96 block pointer-events-none opacity-50">
		<pre>{info}</pre>
	</div>
</div>

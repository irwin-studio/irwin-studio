<script lang="ts">
	import { onMount } from 'svelte';
	import { Renderer } from '../../lib/Renderer';
	import { Layer } from '$lib/Renderer/layer';
	import { Circle } from '$lib/shapes/circle';
	import type { ShapeTheme } from '$lib/Renderer/shape';
	import { Engine } from '$lib/Engine';
	import { Application } from '$lib/Application';
	import { TreeApp } from '$lib/Application/myFirst';

	let renderer: Renderer;

	let canvas: HTMLCanvasElement;
	let width: number, height: number;
	let info: string = '';

	const style = (color: string, width = 2): ShapeTheme => ({
		fillColor: color,
		strokeColor: color,
		strokeWidth: width
	})

	onMount(() => {
		const application = new TreeApp()
		renderer = new Renderer(canvas);
		const engine = new Engine(renderer, application)

		// center screen
		renderer.setScreenOffset([window.innerWidth / 2, window.innerHeight / 2]);

		function updateInfo() {
			info = JSON.stringify(renderer.getInfo(), null, 4);
			// renderer.render();
			requestAnimationFrame(updateInfo);
		}
		updateInfo();

		engine.start()
	});
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="w-screen h-screen bg-blue-100">
	<canvas bind:this={canvas} {height} {width} />
	<div class="p-2 absolute top-0 left-0 h-96 w-96 block pointer-events-none opacity-50">
		<pre>{info}</pre>
	</div>
</div>

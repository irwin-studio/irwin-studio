<script lang="ts">
	import { onMount } from 'svelte';
	import { Renderer } from '../../lib/Renderer';
	import type { ShapeConfig } from '$lib/Renderer/shape';
	import { Vec2 } from '$lib/Renderer/vec2';
	import { Engine } from '$lib/Engine';
	import { Application } from '$lib/Application';
	import { MyFirstApplication } from '$lib/Application/myFirst';

	let renderer: Renderer;

	let canvas: HTMLCanvasElement;
	let width: number, height: number;
  let info: string = ""

	onMount(() => {
		const application = new MyFirstApplication()
		renderer = new Renderer(canvas);
		const engine = new Engine(renderer, application);

    function updateInfo() {
      info = JSON.stringify(engine.getInfo(), null, 4);
      requestAnimationFrame(updateInfo)
    }
    updateInfo()

		engine.start();
	});
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<div class="w-screen h-screen bg-blue-100">
	<canvas
		bind:this={canvas}
		{height}
		{width}
	/>
  <div class="p-2 absolute top-0 left-0 h-96 w-96 block pointer-events-none opacity-50">
  <pre>{info}</pre>
  </div>
</div>

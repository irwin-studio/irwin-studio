<script lang="ts">
	import { TreeView, TreeViewItem } from '@skeletonlabs/skeleton';

	import File from 'svelte-material-icons/File.svelte';
	import Folder from 'svelte-material-icons/Folder.svelte';

	import LinkTree from './index.svelte';
	import { type Link, isLinkGroup } from '../../util/links';

	export let links: Link[];

	const size = 15;
	const height = 100;
</script>

<div class="flex flex-col">
	{#each links as link}
		<div class="flex flex-col">
			<!-- Button -->
			<!-- <div class="{border('red')} flex items-center p-2 rounded-token space-x-1"> -->
			<div class="flex items-center">
				<span class={`w-[20px] h-[20px]`}>
					{#if isLinkGroup(link)}
						<Folder {size} />
					{:else}
						<File {size} />
					{/if}
				</span>

				<span class="whitespace-wrap-none w-auto">
					{#if isLinkGroup(link)}
						<p class="h5">{link.displayText}</p>
					{:else}
						<p class="h5">{link.displayText}</p>
					{/if}
				</span>
			</div>

			<!-- Children -->
			<div class="pl-4">
				{#if isLinkGroup(link)}
					{#each link.links as childLink}
						<LinkTree links={[childLink]} />
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</div>

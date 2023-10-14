<script lang="ts">
	import { group, link, type Link } from '$lib/modules/link';
	import LinkTree from '$lib/components/LinkTree/index.svelte';
	import { writable, type Writable } from 'svelte/store';

	const links: Writable<Link[]> = writable([
		link({
			id: 'introduction',
			displayText: 'Introduction',
			newTab: false,
			href: '/'
		}),
		group({
			id: 'projects',
			displayText: 'Projects',
			links: [
				link({
          id: 'test_a_one',
          displayText: 'A1',
          href: '/'
        }),
        link({
          id: 'test_a_two',
          displayText: 'A2',
          href: '/'
        }),
				group({
					id: 'projects1',
					displayText: 'Projects',
					links: [
						link({
							id: 'test_b_one',
							displayText: 'B1',
							href: '/'
						}),
            link({
							id: 'test_b_two',
							displayText: 'B2',
							href: '/'
						})
					]
				})
			]
		})
	]);
</script>

<div class="flex p-2 h-full w-[280px] bg-surface-800">
	<LinkTree siblings={links} />
</div>

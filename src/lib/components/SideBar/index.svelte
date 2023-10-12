<script lang="ts">
	import { group, link, type Link } from '$lib/util/links';
  import Links from "$components/LinkTree/index.svelte"

	const links: Array<Link> = [
		link('One'),
		group('Group', [
        link('Two'),
        group('Nested Group', [
          link('Three')
        ])
      ])
	];
</script>

<div class="w-min">
	<Links {links} />
</div>

<script lang="ts">
	import { group, link, type Link } from '../../util/links';
	import Links from '../LinkTree/index.svelte';

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

<div class="">
	<p class="h1">Irwin Studio</p>
</div>

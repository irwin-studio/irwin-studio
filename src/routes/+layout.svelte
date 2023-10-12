<script>
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton'
	import TitleBar from '$components/TitleBar/index.svelte'
	import SideBar from '$components/SideBar/index.svelte'
</script>

<AppShell>
	<svelte:fragment slot="header">
		<TitleBar />
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<SideBar />
	</svelte:fragment>
	<!-- (sidebarRight) -->
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
	<!-- (footer) -->
</AppShell>

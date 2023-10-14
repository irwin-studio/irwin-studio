<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar>
  <svelte:fragment slot="lead">
    <strong class="text-xl">Irwin Studio</strong>
  </svelte:fragment>

  <svelte:fragment slot="trail">
    <a
      class="btn btn-sm variant-ghost-surface"
      href="https://skeleton.dev/"
      target="_blank"
      rel="noreferrer"
    >
      Documentation
    </a>
  </svelte:fragment>
</AppBar>

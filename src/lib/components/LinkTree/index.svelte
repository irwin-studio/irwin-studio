<script lang="ts">
  import File from 'svelte-material-icons/TextLong.svelte';
  // import File from 'svelte-material-icons/FileOutline.svelte';
  import Folder from 'svelte-material-icons/FolderOutline.svelte';
  import OpenFolder from 'svelte-material-icons/FolderOpenOutline.svelte';

  import LinkTree from "./index.svelte";
  import { goto } from '$app/navigation';
  import { writable, type Writable } from 'svelte/store';
	import { type Link, type GroupLink, setLinkState, isGroupLink } from '$lib/modules/link';
  
  type ChildClickHandler = (child: Link) => void

  export let siblings: Writable<Link[]>;
  export let onChildClick: ChildClickHandler | undefined = undefined

  const notifyParent = (...args: Parameters<ChildClickHandler>) => {
    return onChildClick?.(...args)
  }

  function classState(state: Link['state']) {
    switch (state) {
      case 'active':
        return "font-bold text-primary-400 border-2 border-transparent underline"
      case 'child-active':
        return "font-bold text-primary-400 border-2 border-transparent underline"
      case 'inactive':
        return "text-slate-500 border-2 border-transparent"
    }
  }

  const createChildClickHandler = (group: GroupLink): ChildClickHandler => {
    return (groupChild: Link) => {
      notifyParent(group) // notify the group's parent

      $siblings.forEach(link => setLinkState(link, 'inactive', { recursive: true }))
      setLinkState(group, 'child-active', { recursive: false })

      siblings.set([...$siblings])
    }
  }


  const handleClick = (link: Link) => {
    return () => {
      if (isGroupLink(link)) {
        link.isOpen = !link.isOpen;
      } else {
        notifyParent(link)

        if (link.newTab) {
          window.open(link.href, '_blank', 'noopener, noreferrer')
        } else {
          goto(link.href)
        }

        $siblings.forEach(link => setLinkState(link, 'inactive', { recursive: true }))
        setLinkState(link, 'active', { recursive: false })
      }

      siblings.set([...$siblings])
    };
  };

  const convertToWritableLinks = (links: Link[]): Writable<Link[]> => {
    const childrenWritable = writable(links)
    return childrenWritable
  }

  const size = 24;
</script>

<div class="flex flex-col w-full">
  {#each $siblings as link}
  <div class="flex flex-col">
    <!-- Button -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div on:click={handleClick(link)} class={`cursor-pointer flex items-center rounded-lg ${classState(link.state)}`} >
        <span class="m-2">
          {#if isGroupLink(link)}
            {#if link.isOpen}
              <OpenFolder {size} />
            {:else}
              <Folder {size} />
            {/if}
          {:else}
            <File {size} />
          {/if}
        </span>

        <span class="whitespace-wrap-none w-auto">
          {#if isGroupLink(link)}
            <p class="h5">{link.displayText}</p>
          {:else}
            <p class="h5">{link.displayText}</p>
          {/if}
        </span>
      </div>

      <!-- Children -->
      <div class="pl-4 pt-1">
        {#if isGroupLink(link) && link.isOpen}
          <LinkTree siblings={convertToWritableLinks(link.links)} onChildClick={createChildClickHandler(link)} />
        {/if}
      </div>
    </div>
  {/each}
</div>

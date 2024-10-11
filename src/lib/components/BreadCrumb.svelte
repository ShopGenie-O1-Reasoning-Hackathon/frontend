<!-- src/lib/components/Breadcrumb.svelte -->
<script>
    //@ts-nocheck
    import { goto } from '$app/navigation';
    import FaChevronRight from 'svelte-icons/fa/FaChevronRight.svelte';
    export let items = [];
    function handleClick(href) {
        goto(href);
    }
</script>

<nav class="text-sm breadcrumbs mb-6" aria-label="Breadcrumb">
    <ul>
        {#each items as item, index}
            <li>
                {#if item.href && index !== items.length - 1}
                    <button
                        on:click={() => handleClick(item.href)}
                        class="link link-hover"
                    >
                        {item.name}
                    </button>
                {:else}
                    <span class="font-semibold">
                        {item.name}
                    </span>
                {/if}
            </li>
        {/each}
    </ul>
</nav>
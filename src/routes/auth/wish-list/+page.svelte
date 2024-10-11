<script>
    import { goto } from '$app/navigation';
    import { fade, scale } from 'svelte/transition';
    import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
    import FaExternalLinkAlt from 'svelte-icons/fa/FaExternalLinkAlt.svelte';
    import FaShoppingCart from 'svelte-icons/fa/FaShoppingCart.svelte';
    import BreadCrumb from '$lib/components/BreadCrumb.svelte';
    import { SvelteToast, toast } from '@zerodevx/svelte-toast';
    import { onMount, onDestroy } from 'svelte';
    import apiService from '$lib/apiService.ts';

    let breadcrumbItems = [
        { name: 'Home', href: '/auth' },
        { name: 'Wishlist', href: '/auth/wishlist' }
    ];

    export let data;
    let wishlistItems = null;
    let recommendations = null;
    let userId = data.authUser.id;

    onMount(async () => {
        data.productList.then((res) => {
            console.log(res);
            wishlistItems = res['products'];
            recommendations = res['recommendations'];
        });
    });

    $: loadingStates = new Map();

    function setLoadingState(productId, isLoading) {
        loadingStates.set(productId, isLoading);
        loadingStates = new Map(loadingStates);
    }

    async function removeFromWishlist(productId) {
        try {
            setLoadingState(productId, true);
            await apiService.post(`cart/remove`, { productId, userId });
            wishlistItems = wishlistItems.filter((item) => item.product_id != productId);
            toast.push('Product Unfavorited Successfully', {
                theme: {
                    '--toastBackground': 'hsl(var(--su))',
                    '--toastBarBackground': 'hsl(var(--suc))'
                }
            });
        } catch (error) {
            toast.push('Failed to unfavorite product. Please try again.', {
                theme: {
                    '--toastBackground': 'hsl(var(--er))',
                    '--toastBarBackground': 'hsl(var(--erc))'
                }
            });
        } finally {
            setLoadingState(productId, false);
        }
    }

    onMount(() => toast.pop(0));
    onDestroy(() => toast.pop(0));
</script>

<SvelteToast />
<div class="container mx-auto px-4 py-8">
    {#if wishlistItems && recommendations}
        <!-- <BreadCrumb items={breadcrumbItems} /> -->

        <header class="mb-12 text-center">
            <h1 class="flex items-center justify-center text-3xl font-bold lg:text-4xl">
                <span class="mr-4 h-8 w-8 text-primary">
                    <FaHeart />
                </span>
                Your Wishlist
            </h1>
        </header>

        {#if wishlistItems.length > 0}
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each wishlistItems as item}
                    <div
                        class="card bg-base-100 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        on:click={() => goto(`/auth/shop-genie/${item.product_id}`)}
                        tabindex="0"
                        role="button"
                        on:keypress={(e) => e.key === 'Enter' && goto(`/auth/shop-genie/${item.product_id}`)}
                        in:fade={{ duration: 300 }}
                        out:scale={{ duration: 300 }}
                    >
                        <figure><img src={item.image_links[0]} alt={item.name} class="h-64 w-full object-scale-down rounded-xl" /></figure>
                        <div class="card-body">
                            <h3 class="card-title text-lg">{item.name}</h3>
                            <p class="text-sm opacity-70">{item.company}</p>
                            <p class="mt-2 text-xl font-bold text-primary">{item.price}</p>
                            <div class="card-actions justify-end">
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="btn btn-circle btn-ghost btn-sm"
                                    on:click|stopPropagation
                                    aria-label="View on external site"
                                >
                                    <span class="h-5 w-5">
                                        <FaExternalLinkAlt />
                                    </span>
                                </a>
                                <button
                                    on:click|stopPropagation={() => removeFromWishlist(item.product_id)}
                                    class="btn btn-circle btn-primary btn-sm"
                                    aria-label="Remove from wishlist"
                                >
                                    {#if loadingStates.get(item.product_id)}
                                        <span class="loading loading-spinner loading-xs"></span>
                                    {:else}
                                        <span class="h-5 w-5">
                                            <FaHeart />
                                        </span>
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="text-center">
                <p class="text-xl opacity-70">Your wishlist is empty.</p>
                <button
                    on:click={() => goto('/auth/shop-genie')}
                    class="btn btn-primary mt-4"
                >
                    Explore Products
                </button>
            </div>
        {/if}

        <section class="mt-16">
            <h2 class="mb-8 text-2xl font-bold lg:text-3xl">Recommended Products</h2>
            {#if recommendations && recommendations.length > 0}
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {#each recommendations as product}
                        <div
                            class="card bg-base-100 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                            on:click={() => goto(`/auth/shop-genie/${product.product_id}`)}
                            tabindex="0"
                            role="button"
                            on:keypress={(e) => e.key === 'Enter' && goto(`/auth/shop-genie/${product.product_id}`)}
                        >
                            <figure><img src={product.image_links[0]} alt={product.name} class="h-48 w-full object-scale-down rounded-xl" /></figure>
                            <div class="card-body">
                                <h4 class="card-title text-lg">{product.name}</h4>
                                <p class="text-sm opacity-70">{product.company}</p>
                                <p class="mt-2 text-xl font-bold text-primary">{product.price}</p>
                                <div class="card-actions justify-end">
                                    <button class="btn btn-primary btn-sm">
                                        <span class="mr-2 h-4 w-4">
                                            <FaShoppingCart />
                                        </span>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class="text-center text-xl opacity-70">
                    No recommendations available at the moment.
                </p>
            {/if}
        </section>
    {:else}
        <div class="flex h-screen items-center justify-center">
            <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        font-family: 'Poppins', sans-serif;
    }
</style>
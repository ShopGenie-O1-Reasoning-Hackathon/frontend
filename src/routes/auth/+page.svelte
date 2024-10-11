<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import FaShoppingCart from 'svelte-icons/fa/FaShoppingCart.svelte';
	import categoriesData from '$lib/data/categories.json';
	import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
	import mockProductData from '$lib/data/mockProducts.json';
	import BreadCrumb from '$lib/components/BreadCrumb.svelte';
	import apiService from '$lib/apiService';

	let breadcrumbItems = [
		{ name: 'Home', href: './' },
		{ name: 'Shop Genie', href: '.' }
	];

	const categories = categoriesData;

	let selectedCategory = categories[0];
	// console.log('Selected Category', selectedCategory);
	let selectedSubcategory = null;
	let products = [];
	let loading = false;
	let offset = null;
    let hasMoreProducts = true;
	export let data;
	let userId = data.authUser.id;
	console.log('User id', userId);

	function selectCategory(category) {
		selectedCategory = category;
		selectedSubcategory = null;
		products = [];
	}

	function selectSubcategory(subcategory) {
		selectedSubcategory = subcategory;
		fetchProducts();
	}

	async function fetchProducts(loadMore = false) {
		loading = true;
		if (!loadMore) {
			products = [];
			offset = null;
		}

		console.log(selectCategory, selectedSubcategory);

		let payload = {
			category: selectedCategory.category.searchName,
			sub_category: selectedSubcategory.searchName,
			limit: 10,
			offset: offset
		};

		const data = await apiService.postPython(`product_retrieve/category`, payload);
		products = loadMore ? [...products, ...data['products']] : data['products'];
		offset = data['next_offset'];
		hasMoreProducts = data['products'].length === 10; // Assuming the API always returns 10 items if there are more
		loading = false;
	}

	function loadMore() {
		if (hasMoreProducts) {
			fetchProducts(true);
		}
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="font-poppins container mx-auto px-4 py-12">
	<!-- <BreadCrumb items={breadcrumbItems} /> -->
	<header class="relative mb-16">
		<div class="mb-4 flex items-center justify-between">
			<div class="w-10"></div>
			<!-- Spacer to balance the layout -->
			<h1
				class="flex items-center text-4xl font-bold tracking-tight text-primary"
			>
				<span class="mr-4 h-10 w-10 text-primary">
					<FaShoppingCart />
				</span>
				Shop Genie
			</h1>
			<button
				class="rounded-full bg-base-100 p-2 text-secondary transition-colors duration-200 ease-in-out hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
				on:click={() => goto('/auth/shop-genie/search')}
				aria-label="Search"
			>
				<div class="flex h-6 w-6 items-center justify-center">
					<FaSearch />
				</div>
			</button>
		</div>
		<p class="text-center text-xl font-light">
			Discover Your Perfect Style from an Invertory of over 20000 Products
		</p>
	</header>

	<div class="flex flex-col gap-8 lg:flex-row">
		<!-- Main Categories -->
		<div class="lg:w-1/4">
			<h2 class="mb-4 text-2xl font-semibold text-primary">Categories</h2>
			<div class="space-y-2">
				{#each categories as category}
					<button
						on:click={() => selectCategory(category)}
						class="mb-2 w-full rounded-lg px-6 py-4 text-left shadow-sm transition-all duration-200 ease-in-out {selectedCategory
							.category.shownName === category.category.shownName
							? 'bg-success font-medium'
							: 'bg-base-100 hover:bg-base-200'}"
					>
						{category.category.shownName}
					</button>
				{/each}
			</div>
		</div>

		<div class="lg:w-3/4">
			<!-- Subcategories -->
			<h2 class="mb-4 text-2xl font-semibold text-primary">
				{selectedCategory.category.shownName} Collections
			</h2>
			<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each selectedCategory.subcategories as subcategory}
					<button
						on:click={() => selectSubcategory(subcategory)}
						class="group flex flex-col items-center justify-center rounded-xl bg-base-100 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg {selectedSubcategory ===
						subcategory
							? 'ring-2 ring-error'
							: ''}"
						in:fade={{ duration: 200 }}
					>
						<h3
							class="text-center text-lg font-medium transition-colors duration-200 group-hover:text-primary"
						>
							{subcategory.shownName}
						</h3>
					</button>
				{/each}
			</div>

			<!-- Products -->
			{#if selectedSubcategory}
				<h3 class="mb-4 text-xl font-semibold text-primary">
					{selectedSubcategory.shownName}
				</h3>
				{#if loading && products.length === 0}
					<div class="flex h-64 items-center justify-center">
						<div class="loader"></div>
					</div>
				{:else}
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{#each products as product}
							<div
								class="hover:scale-105 cursor-pointer overflow-hidden rounded-xl bg-base-100 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
								on:click={() => goto(`/auth/shop-genie/${product.product_id}`)}
								tabindex="0"
								role="button"
								on:keypress={(e) =>
									e.key === 'Enter' && goto(`/auth/shop-genie/${product.product_id}`)}
							>
								<img
									src={product.image_links[0]}
									alt={product.name}
									class="h-auto w-full object-cover"
								/>
								<div class="p-4">
									<h4
										class="text-lg font-medium transition-colors duration-200 group-hover:text-primary"
									>
										{product.name}
									</h4>
									<p class="mb-2 text-sm">{product.company}</p>
									<p class="mt-2 font-bold text-secondary">
										{product.price}
									</p>
								</div>
							</div>
						{:else}
							<p class="">
								No products available in this category.
							</p>
						{/each}
					</div>
					{#if hasMoreProducts}
						<div class="mt-8 flex justify-center">
							<button
								on:click={loadMore}
								class="rounded-full bg-secondary px-6 py-2 hover:bg-success focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
								disabled={loading}
							>
								{loading ? 'Loading...' : 'Load More'}
							</button>
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
	:global(body) {
		font-family: 'Poppins', sans-serif;
	}

	.loader {
		border: 5px solid #f3f3f3; /* Light grey */
		border-top: 5px solid #3498db; /* Blue */
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.hover\:scale-102:hover {
		transform: scale(1.02);
	}
</style>

<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	// import mockProductData from '$lib/data/mockProducts.json';
	import { fade } from 'svelte/transition';
	import BreadCrumb from '$lib/components/BreadCrumb.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import { invalidate } from '$app/navigation';
	import HeartFilled from '$lib/components/HeartFilled.svelte';
	import HeartOutline from '$lib/components/HeartOutline.svelte';
	import { afterUpdate } from 'svelte';
	import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
	import apiService from '$lib/apiService';

	Chart.register(PieController, ArcElement, Tooltip, Legend);
	import FaUser from 'svelte-icons/fa/FaUser.svelte';

	Chart.register(PieController, ArcElement, Tooltip);

	let reviews = [];
	let currentPage = 1;
	let reviewsPerPage = 5;
	let selectedSentiment = 'all';

	let newReview = '';
	let sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

	let chart;
	let chartCanvas;

	// Function to handle navigation and ensure data reload
	async function handleNavigation(productId) {
		await goto(`./${productId}`);
		product = null;
		similarProducts = null;
		window.location.reload();
	}

	export let data;
	let id = $page.params.productId;
	let product = null;
	let similarProducts = null;
	let imageLoaded = false;
	let breadcrumbItems = [];
	let specifications = [];
	let isFavorite = null;
	let userId = data.authUser.id;

	console.log("User id", userId);

	onMount(async () => {
		// product = mockProductData.find((p) => p.product_id == id);
		data.productData.then((res) => {
			product = res['product'];
			similarProducts = res['similar_products'];

			console.log(res);
			breadcrumbItems = [
				{ name: 'Home', href: '../' },
				{ name: 'Shop Genie', href: './' },
				{ name: `${product.name}`, href: `` }
			];
		});

		data.isFavorite.then((res) => {
			isFavorite = res['isInCart'];
		});

		data.reviewList.then((res) => {
			reviews = res;
			updateSentimentCounts();
			initChart();
		});
	});

	function updateSentimentCounts() {
		sentimentCounts = reviews.reduce(
			(counts, review) => {
				counts[review.review_sentiment]++;
				return counts;
			},
			{ positive: 0, neutral: 0, negative: 0 }
		);
	}

	afterUpdate(() => {
		if (!chart && chartCanvas) {
			initChart();
		} else if (chart) {
			updateChart();
		}
	});

	function initChart() {
		if (chartCanvas) {
			chart = new Chart(chartCanvas, {
				type: 'pie',
				data: {
					labels: ['Positive', 'Neutral', 'Negative'],
					datasets: [
						{
							data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative],
							backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							position: 'bottom'
						},
						tooltip: {
							callbacks: {
								label: (context) => `${context.label}: ${context.raw}`
							}
						}
					}
				}
			});
		}
	}

	function updateChart() {
		if (chart) {
			chart.data.datasets[0].data = [
				sentimentCounts.positive,
				sentimentCounts.neutral,
				sentimentCounts.negative
			];
			chart.update();
		}
	}

	let isSubmittingReview = false;

	async function submitReview() {
		if (!newReview.trim()) {
			toast.push('Review is Empty!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(187,72,120,0.9)',
					'--toastBarBackground': '#880808'
				}
			});
			return;
		}

		isSubmittingReview = true;
		
		const newSentiment = await apiService.postPython('sentiment_analysis/analyze_sentiment', {
			text: newReview
		});

		if (!newSentiment) {
			toast.push('Review Submission Failed!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(187,72,120,0.9)',
					'--toastBarBackground': '#880808'
				}
			});
			return;
		}

		let payload = {
			user_id: userId,
			product_id: id,
			user_comment: newReview,
			review_sentiment: newSentiment['sentiment']
		};
		console.log(payload)
		const response = await apiService.postPython('reviews/add', payload);

		if (!response) {
			toast.push('Review Submission Failed!', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(187,72,120,0.9)',
					'--toastBarBackground': '#880808'
				}
			});
			return;
		}

		reviews = [...reviews, response];
		newReview = '';
		toast.push('Review submitted successfully', {
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgba(72,187,120,0.9)',
				'--toastBarBackground': '#2F855A'
			}
		});
		isSubmittingReview = false;

		updateSentimentCounts();
		updateChart();
	}

	function handleImageLoad() {
		imageLoaded = true;
	}

	function decodeHtmlEntities(text) {
		return text.replace(/&#039;/g, "'").replace(/&quot;/g, '"');
	}

	function parseSpecifications(specString) {
		// Decode HTML entities before processing
		const decodedSpecString = decodeHtmlEntities(specString);

		return decodedSpecString
			.split('. ')
			.map((spec) => {
				// Split only on the first occurrence of "is"
				const [key, ...rest] = spec.split(' is ');
				const value = rest.join(' is '); // Join the rest back together to handle multiple "is"
				return { key: key.trim(), value: value ? value.trim() : '' };
			})
			.filter((spec) => spec.key && spec.value); // Remove any invalid pairs
	}

	$: if (product) {
		specifications = product ? parseSpecifications(product.specifications) : [];
	}

	let isLoading = false;

	function simulateApiCall() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({ ok: true });
			}, 500); // Simulate a 500ms delay
		});
	}

	async function toggleFavorite() {
		const endpoint = isFavorite ? `cart/remove` : `cart/add`;
		try {
			isLoading = true;

			const payload = {
				productId: String(id),
				userId: String(userId)
			};

			console.log(payload);

			// const response = await simulateApiCall();
			const response = await apiService.postPython(endpoint, payload);

			if (response) {
				isFavorite = !isFavorite;
				const action = isFavorite ? 'added to' : 'removed from';
				toast.push(`Product ${action} favorites`, {
					theme: {
						'--toastColor': 'mintcream',
						'--toastBackground': 'rgba(72,187,120,0.9)',
						'--toastBarBackground': '#2F855A'
					}
				});
			} else {
				throw new Error(`Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`);
			}
		} catch (error) {
			console.error('Error updating favorites:', error);
			toast.push('Failed to update favorites', {
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgba(187,72,120,0.9)',
					'--toastBarBackground': '#880808'
				}
			});
		} finally {
			isLoading = false;
		}
	}

	$: filteredReviews =
		selectedSentiment === 'all'
			? reviews
			: reviews.filter((review) => review.review_sentiment === selectedSentiment);

	$: paginatedReviews = filteredReviews.slice(
		(currentPage - 1) * reviewsPerPage,
		currentPage * reviewsPerPage
	);

	$: totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

	function goToNextPage() {
		if (currentPage < totalPages) {
			currentPage++;
		}
	}

	function goToPreviousPage() {
		if (currentPage > 1) {
			currentPage--;
		}
	}

	function handleSentimentChange(event) {
		selectedSentiment = event.target.value;
		currentPage = 1; // Reset to first page when changing sentiment
	}

	onMount(() => {
		toast.pop(0);
	});

	onDestroy(() => {
		toast.pop(0);
	});
</script>

<SvelteToast />
<div class="font-poppins container mx-auto px-4 py-12">
	{#if product && reviews}
		<!-- <BreadCrumb items={breadcrumbItems} /> -->
		<div
			class="font-poppins container mx-auto px-4 py-12 md:w-3/4 lg:w-2/3"
			in:fade={{ duration: 300 }}
		>
			<div class="overflow-hidden rounded-2xl bg-base-100">
				<div class="flex flex-col lg:flex-row">
					<!-- Product Image -->
					<div class="p-4 lg:w-2/5 lg:p-8">
						<div class="aspect-w-1 aspect-h-1 relative overflow-hidden rounded-lg">
							{#if !imageLoaded}
								<div
									class="absolute inset-0 flex animate-pulse items-center justify-center bg-base-200"
								>
									<svg
										class="h-12 w-12 text-gray-400"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								</div>
							{/if}
							<img
								src={product.image_links[0]}
								alt={product.name}
								class="h-full w-full object-cover transition-opacity duration-300 ease-in-out {imageLoaded
									? 'opacity-100'
									: 'opacity-0'}"
								on:load={handleImageLoad}
							/>
						</div>
					</div>

					<!-- Product Details -->
					<div class="flex flex-col justify-between p-6 lg:w-3/5 lg:p-8">
						<div>
							<div class="mb-4 flex items-center justify-between">
								<h1 class="text-2xl font-bold md:text-3xl">
									{product.name}
								</h1>
								<button
									on:click={toggleFavorite}
									disabled={isLoading}
									class="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 transition-all duration-300 hover:scale-110 hover:bg-indigo-200 {isLoading
										? 'cursor-not-allowed opacity-50'
										: ''}"
								>
									<div
										class="h-6 w-6"
										class:text-indigo-600={isFavorite}
										class:text-indigo-400={!isFavorite}
									>
										{#if isLoading}
											<div
												class="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"
											></div>
										{:else if isFavorite}
											<HeartFilled />
										{:else}
											<HeartOutline />
										{/if}
									</div>
								</button>
							</div>
							<p
								class="mb-4 text-xl font-semibold text-primary md:text-2xl"
							>
								{product.price}
							</p>
							<div class="mb-6 flex flex-wrap gap-2">
								{#each [product.gender, product.category, product.company] as tag}
									<span
										class="rounded-full bg-success px-3 py-1 text-xs font-medium"
									>
										{tag}
									</span>
								{/each}
							</div>
							<p class="mb-6 text-base leading-relaxed">
								{product.description}
							</p>

							<div class="mb-6 rounded-xl bg-base-200 p-4 shadow-inner">
								<h2 class="mb-3 text-lg font-semibold">
									Specifications
								</h2>
								<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
									{#each specifications as spec}
										<div class="flex flex-col">
											<span class="text-sm font-medium text-accent"
												>{spec.key}</span
											>
											<span class="text-sm">{spec.value}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>

						<div>
							<a
								href={product.link}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-block w-full rounded-lg bg-primary px-4 py-2 text-center font-bold transition duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto dark:focus:ring-offset-gray-800"
							>
								View on {product.company}
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Product Reviews Section -->
		<div class="mt-12">
			<h2 class="mb-6 text-3xl font-bold">Product Reviews</h2>

			<!-- Sentiment Analysis Chart -->
			<div class="mb-8">
				<h3 class="mb-4 text-xl font-semibold">Sentiment Analysis</h3>
				{#if reviews.length}
					<div class="h-64 w-full max-w-md">
						<canvas bind:this={chartCanvas}></canvas>
					</div>
				{:else}
				<!-- <div class="h-64 w-full max-w-md flex items-center justify-center bg-gray-100 rounded-lg"> -->
					<p class="text-lg text-error text-center px-4">
					  No reviews available for this product.
					</p>
				  <!-- </div> -->
				{/if}
			</div>

			<!-- Review Form -->
			<div class="mb-8">
				<h3 class="mb-4 text-xl font-semibold">Write a Review</h3>
				<textarea
					bind:value={newReview}
					class="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600"
					rows="4"
					placeholder="Share your thoughts about this product..."
				></textarea>
				<button
					on:click={submitReview}
					disabled={isSubmittingReview}
					class="mt-2 flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-bold text-white disabled:opacity-50"
				>
					{#if isSubmittingReview}
						<span
							class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></span>
					{/if}
					{isSubmittingReview ? 'Submitting...' : 'Submit Review'}
				</button>
			</div>

			<!-- Review List -->
			<div>
				<h3 class="mb-4 text-xl font-semibold">Customer Reviews</h3>

				<!-- Sentiment Filter -->
				<div class="mb-4">
					<label for="sentiment-filter" class="mr-2"
						>Filter by sentiment:</label
					>
					<select
						id="sentiment-filter"
						bind:value={selectedSentiment}
						on:change={handleSentimentChange}
						class="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600"
					>
						<option value="all">All</option>
						<option value="positive">Positive</option>
						<option value="neutral">Neutral</option>
						<option value="negative">Negative</option>
					</select>
				</div>

				{#each paginatedReviews as review}
					<div class="mb-4 rounded-lg bg-base-100 shadow">
						<div class="mb-2 flex items-center">
							{#if review.profile_picture_url}
								<img
									src={review.profile_picture_url}
									alt={review.user_name}
									class="mr-2 h-10 w-10 rounded-full"
								/>
							{:else}
								<div
									class="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-base-200"
								>
									<div class="h-6 w-6">
										<FaUser />
									</div>
								</div>
							{/if}
							<div>
								<p class="font-semibold">{review.user_name}</p>
								<p class="text-sm">
									{review.created_at.split('T')[0]}
								</p>
							</div>
						</div>
						<p class="">{review.user_comment}</p>
						<span
							class="mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold"
							class:bg-green-200={review.review_sentiment === 'positive'}
							class:text-green-800={review.review_sentiment === 'positive'}
							class:bg-yellow-200={review.review_sentiment === 'neutral'}
							class:text-yellow-800={review.review_sentiment === 'neutral'}
							class:bg-red-200={review.review_sentiment === 'negative'}
							class:text-red-800={review.review_sentiment === 'negative'}
						>
							{review.review_sentiment}
						</span>
					</div>
				{/each}
				<!-- Pagination Controls -->
				<div class="mt-4 flex items-center justify-between">
					<button
						on:click={goToPreviousPage}
						disabled={currentPage === 1}
						class="rounded bg-secondary px-4 py-2 font-bold disabled:opacity-50"
					>
						Previous
					</button>
					<span class="">
						Page {currentPage} of {totalPages}
					</span>
					<button
						on:click={goToNextPage}
						disabled={currentPage === totalPages}
						class="rounded bg-success px-4 py-2 font-bold disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>

		<!-- Similar Products Section -->
		{#if similarProducts && similarProducts.length > 0}
			<div class="mt-12">
				<h2 class="mb-6 text-3xl font-bold">Similar Products</h2>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{#each similarProducts as similarProduct}
						<div
							class="hover:scale-102 cursor-pointer overflow-hidden rounded-xl bg-base-100 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
							on:click={() => handleNavigation(similarProduct.product_id)}
							tabindex="0"
							role="button"
							on:keypress={(e) => e.key === 'Enter' && handleNavigation(similarProduct.product_id)}
						>
							<img
								src={similarProduct.image_links[0]}
								alt={similarProduct.name}
								class="h-auto w-full object-cover"
							/>
							<div class="p-4">
								<h4
									class="text-lg font-medium transition-colors duration-200 group-hover:text-primary"
								>
									{similarProduct.name}
								</h4>
								<p class="mb-2 text-sm">
									{similarProduct.company}
								</p>
								<p class="mt-2 font-bold text-primary">
									{similarProduct.price}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{:else}
		<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
			<div
				class="spinner h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
			></div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		font-family: 'Poppins', sans-serif;
	}
</style>

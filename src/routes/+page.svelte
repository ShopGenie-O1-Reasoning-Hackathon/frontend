<script>
    import { goto } from '$app/navigation';
    import { fade, scale } from 'svelte/transition';
    import logo from '$lib/images/logo.png';
    import gif1 from '$lib/images/buy-2.gif';
    import gif2 from '$lib/images/search2.gif';
    import FaShoppingBag from 'svelte-icons/fa/FaShoppingBag.svelte';
    import FaRobot from 'svelte-icons/fa/FaRobot.svelte';
    import FaChartBar from 'svelte-icons/fa/FaChartBar.svelte';
    import FaSearch from 'svelte-icons/fa/FaSearch.svelte';
    import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte';
    import Navbar from '$lib/components/navbar_no_auth.svelte';
    import Footer from '$lib/components/Footer_no_auth.svelte';

    const features = [
        {
            Icon: FaShoppingBag,
            title: "Large Collection",
            description: "We have a collection over 20k products in ShopGenie"
        },
        {
            Icon: FaRobot,
            title: "Product Recommendation",
            description: "Recommend users suitable products based on their favourite list choice"
        },
        {
            Icon: FaChartBar,
            title: "Product Analysis",
            description: "Quickly take decision about a product seeing other users's reviews and their corresponding sentiments"
        },
        {
            Icon: FaSearch,
            title: "Smart-search",
            description: "Search for a product with text, image or even both !"
        }
    ];
</script>


<style>
	:global(.icon) {
		width: 100%;
		height: 100%;
	}
	
	:global(body) {
		font-family: 'Roboto', sans-serif;
	}
    @keyframes scale-up-center {
		0% {
			-webkit-transform: scale(0.5);
			transform: scale(0.5);
		}
		100% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
	.scale-up-center {
		-webkit-animation: scale-up-center 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) both;
		animation: scale-up-center 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) both;
	}
</style>

<div class="flex flex-col min-h-screen bg-base-100">
  <Navbar />
  
  <main class="flex-grow">
    <section class="hero min-h-screen bg-base-200 px-4">
      <div class="hero-content text-center max-w-5xl w-full mx-auto">
          <div class="w-full">
              <img class="scale-up-center h-32 md:h-48 lg:h-64 w-auto mx-auto mb-12" src={logo} alt="ShopGenie Logo" />
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Revolutionize Your Shopping Experiences with 
                  <span class="text-primary block mt-2">ShopGenie</span>
              </h1>
              <p class="text-xl mb-12 max-w-2xl mx-auto">Harness the power of AI to efficiently and easily get your desired products</p>
              <div class="flex flex-col sm:flex-row justify-center gap-6">
                <button on:click={() => goto('/login')} class="btn btn-primary btn-lg rounded-full px-8 py-3 text-lg font-semibold inline-flex items-center">
                  <span>Get Started</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
              </button>
                  <button on:click={() => goto('#')} class="btn btn-outline btn-secondary btn-lg rounded-full px-8 py-3 text-lg font-semibold">
                      Demo Video
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                      </svg>
                  </button>
              </div>
          </div>
      </div>
  </section>

      <section class="py-16 bg-base-100">
          <div class="container mx-auto px-4">
              <div class="flex flex-col lg:flex-row items-center gap-16">
                  <div class="lg:w-1/2">
                      <h2 class="text-4xl font-bold text-primary mb-6">Tired of Conventional <span class="text-secondary">Websites?</span></h2>
                      <p class="text-lg mb-8">Wasting a lot of time and effort scrolling through web-pages? Still not getting what you want?</p>
                      <div class="flex flex-wrap gap-4">
                          <span class="badge badge-primary badge-outline">Key-word based search</span>
                          <span class="badge badge-primary badge-outline">Time-consuming</span>
                          <span class="badge badge-primary badge-outline">Limited options</span>
                      </div>
                  </div>
                  <div class="lg:w-1/2">
                      <img class="rounded-lg" src={gif2} alt="Conventional Search" />
                  </div>
              </div>
          </div>
      </section>

      <section class="py-16 bg-base-200">
          <div class="container mx-auto px-4">
              <div class="flex flex-col lg:flex-row-reverse items-center gap-16">
                  <div class="lg:w-1/2">
                      <h2 class="text-4xl font-bold text-primary mb-6">Why Choose <span class="text-secondary">ShopGenie?</span></h2>
                      <p class="text-lg mb-8">ShopGenie enables you to get your desired product in the shortest possible time. You can search with text, image, or both. Experience a revolutionary AI-powered Shopping companion that transforms how you search for your fashion products.</p>
                      <div class="flex flex-wrap gap-4">
                          <span class="badge badge-secondary badge-outline">Large Collection</span>
                          <span class="badge badge-secondary badge-outline">Semantic search</span>
                          <span class="badge badge-secondary badge-outline">Search with text</span>
                          <span class="badge badge-secondary badge-outline">Search with image</span>
                          <span class="badge badge-secondary badge-outline">Search with both</span>
                      </div>
                  </div>
                  <div class="lg:w-1/2">
                      <img class="rounded-lg" src={gif1} alt="ShopGenie Search" />
                  </div>
              </div>
          </div>
      </section>

      <section class="py-16 bg-base-100">
          <div class="container mx-auto px-4">
              <h2 class="text-4xl font-bold text-center text-primary mb-12">Enhance Your Shopping Experiences with AI</h2>
              <p class="text-xl text-center mb-16">ShopGenie equips users with AI-driven tools for Product search, product recommendation and product analysis</p>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {#each features as { Icon, title, description }}
                      <div class="card bg-base-200 shadow-xl">
                          <div class="card-body items-center text-center">
                              <div class="w-16 h-16 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mb-4">
                                  <Icon class="w-8 h-8 text-primary" />
                              </div>
                              <h3 class="card-title text-2xl mb-4">{title}</h3>
                              <p>{description}</p>
                          </div>
                      </div>
                  {/each}
              </div>
          </div>
      </section>
  </main>

  <Footer />
</div>
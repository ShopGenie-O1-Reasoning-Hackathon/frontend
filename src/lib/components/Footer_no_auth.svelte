<!-- src/lib/components/Footer.svelte -->
<script>
	import FaLinkedin from 'svelte-icons/fa/FaLinkedin.svelte';
	import FaTwitter from 'svelte-icons/fa/FaTwitter.svelte';
	import FaFacebook from 'svelte-icons/fa/FaFacebook.svelte';
</script>

<footer class="bg-indigo-900 py-12 text-white dark:bg-gray-900">
	<div class="container mx-auto px-4 text-center">
		<h3 class="mb-4 text-2xl font-bold">ShopGenie</h3>
		<p class="mb-8 text-lg max-w-2xl mx-auto">Empowering Fashion-Enthusiasts with AI-driven learning tools since 2024</p>

		<div class="mb-8 flex justify-center space-x-6">
			<a href="#" class="icon-link">
				<FaLinkedin class="icon transition duration-300 hover:text-purple-400" />
			</a>
			<a href="#" class="icon-link">
                <FaTwitter class="icon transition duration-300 hover:text-purple-400" />
            </a>
			<a href="#" class="icon-link">
                <FaFacebook class="icon transition duration-300 hover:text-purple-400" />
            </a>
		</div>

		<div class="mb-8 flex flex-wrap justify-center gap-4">
			<a href="#" class="text-sm hover:text-purple-400 transition duration-300">Privacy Policy</a>
			<a href="#" class="text-sm hover:text-purple-400 transition duration-300">Terms of Service</a>
			<a href="#" class="text-sm hover:text-purple-400 transition duration-300">Contact Us</a>
		</div>

		<p class="text-sm text-indigo-200 dark:text-gray-400">&copy; 2024 ShopGenie. All rights reserved.</p>
	</div>
</footer>

<style>
	.icon-link {
		width: 32px;
		height: 32px;
		display: inline-block;
	}
	.icon {
		width: 100%;
		height: 100%;
	}
</style>
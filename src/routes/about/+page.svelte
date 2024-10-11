<script>
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/navbar_no_auth.svelte';
	import Footer from '$lib/components/short_footer.svelte';

</script>

<style>
	:global(.icon) {
		width: 100%;
		height: 100%;
	}
	
	:global(body) {
		font-family: 'Roboto', sans-serif;
	}
    
</style>

<div class="row">
	<Navbar />
    <h1>
        Section Under Developement
    </h1>
    <Footer/>
</div>
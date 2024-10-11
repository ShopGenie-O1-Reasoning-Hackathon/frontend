<script>
	import { slide } from 'svelte/transition';
	import logo from '$lib/images/logo.png';
	import Themeswitcher from './themeswitcher.svelte';
	let isMenuOpen = false;
	const navItems = [
	  { href: '/about', title: 'About' },
	  { href: '/login', title: 'Get Started' }
	];
	function toggleMenu() {
	  isMenuOpen = !isMenuOpen;
	}
	function closeMenu() {
	  isMenuOpen = false;
	}
   </script>
   
   <nav class="sticky top-0 z-20 bg-base-100 shadow-lg">
	 <div class="container mx-auto px-6 py-3">
	   <div class="flex items-center justify-between">
		 <a href="/" class="flex items-center text-2xl font-bold text-primary">
		   <img src={logo} class="mr-2 h-10 hover:scale-105 transition-transform duration-300" alt="ShopGenie Logo" />
		   Shop<span class="text-secondary">Genie</span>
		 </a>
		 <div class="flex md:hidden">
		   <button
			 on:click={toggleMenu}
			 class="text-primary transition-colors duration-300 hover:text-secondary focus:text-secondary focus:outline-none"
		   >
			 <svg
			   class="h-6 w-6"
			   fill="none"
			   stroke="currentColor"
			   viewBox="0 0 24 24"
			   xmlns="http://www.w3.org/2000/svg"
			 >
			   <path
				 stroke-linecap="round"
				 stroke-linejoin="round"
				 stroke-width="2"
				 d="M4 6h16M4 12h16m-7 6h7"
			   />
			 </svg>
		   </button>
		 </div>
		 <ul class="hidden space-x-1 md:flex items-center">
		   <Themeswitcher />
		   {#each navItems as { href, title }}
			 <li>
			   <a
				 {href}
				 class="btn btn-ghost btn-sm rounded-full text-base-content hover:bg-base-200"
				 on:click={closeMenu}
			   >
				 {title}
			   </a>
			 </li>
		   {/each}
		 </ul>
	   </div>
	 </div>
	 {#if isMenuOpen}
	   <div
		 transition:slide
		 class="absolute left-0 top-full z-20 w-full bg-base-100 shadow-lg md:hidden"
	   >
		 <ul class="space-y-2 px-6 py-4">
		   {#each navItems as { href, title }}
			 <li>
			   <a
				 {href}
				 class="btn btn-ghost btn-sm rounded-full w-full justify-start text-base-content hover:bg-base-200"
				 on:click={closeMenu}
			   >
				 {title}
			   </a>
			 </li>
		   {/each}
		   <li><Themeswitcher /></li>
		 </ul>
	   </div>
	 {/if}
   </nav>
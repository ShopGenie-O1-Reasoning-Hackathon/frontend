<script>
	import { onMount } from 'svelte';
	import FaSun from 'svelte-icons/fa/FaSun.svelte';
	import FaMoon from 'svelte-icons/fa/FaMoon.svelte';
	import FaBuilding from 'svelte-icons/fa/FaBuilding.svelte';
	import FaCoffee from 'svelte-icons/fa/FaCoffee.svelte';
	import FaBirthdayCake from 'svelte-icons/fa/FaBirthdayCake.svelte';
	import FaRocket from 'svelte-icons/fa/FaRocket.svelte';
   
	let currentTheme;
   
	const themes = [
	  { name: 'light', icon: FaSun, label: 'Light' },
	  { name: 'dark', icon: FaMoon, label: 'Dark' },
	  { name: 'corporate', icon: FaBuilding, label: 'Corporate' },
	  { name: 'coffee', icon: FaCoffee, label: 'Coffee' },
	  { name: 'cupcake', icon: FaBirthdayCake, label: 'Cupcake' },
	  { name: 'cyberpunk', icon: FaRocket, label: 'Cyberpunk' }
	];
   
	function setTheme(theme) {
	  document.documentElement.setAttribute('data-theme', theme);
	  localStorage.setItem('theme', theme);
	  currentTheme = theme;
	}
   
	onMount(() => {
	  currentTheme = localStorage.getItem('theme') || 'light';
	  setTheme(currentTheme);
	});
   </script>
   
   <div class="dropdown dropdown-end">
	 <button tabindex="0" class="btn btn-ghost btn-circle">
	   <div class="w-5 h-5">
		 <FaSun />
	   </div>
	 </button>
	 <ul tabindex="0" class="dropdown-content z-[1] p-2 shadow-lg bg-base-200 rounded-box w-52 mt-4">
	   {#each themes as theme}
		 <li class="mb-2">
		   <button
			 class="btn btn-sm btn-block justify-start {currentTheme === theme.name ? 'btn-primary' : 'btn-ghost'}"
			 on:click={() => setTheme(theme.name)}
		   >
			 <span class="mr-2 w-4 h-4">
			   <svelte:component this={theme.icon} />
			 </span>
			 {theme.label}
		   </button>
		 </li>
	   {/each}
	 </ul>
   </div>
<!-- src/routes/+layout.svelte -->
<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import Topbar from '$lib/components/navbar_auth.svelte';
    import { fade } from 'svelte/transition';
    
    let loaded = false;
    export let data;
    let { session, supabase, authUser } = data;
    $: ({ session, supabase, authUser } = data);
    
    let username = authUser.name;
    const navItems = [
      // Add your navigation items here when ready
    ];
    
    onMount(() => {
      loaded = true;
    });
    </script>
    
    <svelte:head>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    </svelte:head>
    
    <style>
      :global(body) {
        font-family: 'Poppins', sans-serif;
      }
    </style>
    
    {#if loaded}
      <div in:fade={{ duration: 300 }} class="flex flex-col min-h-screen bg-base-200">
        <!-- Topbar -->
        <Topbar {username} {navItems} />
        
        <!-- Main content -->
        <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-base-200 to-base-300">
          <div class="container mx-auto px-4 py-8">
            <slot />
          </div>
        </main>
        
        <!-- Footer -->
        <footer class="footer footer-center p-4 bg-base-300 text-base-content">
          <div>
            <p>Copyright © 2024 - All rights reserved by ShopGenie 🏆</p>
          </div>
        </footer>
      </div>
    {/if}
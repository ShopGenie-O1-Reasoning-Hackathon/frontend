<!-- src/components/navbar_auth.svelte -->
<script>
  // @ts-nocheck
  import { fade } from 'svelte/transition';
  import FaUser from 'svelte-icons/fa/FaUser.svelte';
  import FaUserCircle from 'svelte-icons/fa/FaUserCircle.svelte';
  import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte';
  import FaShoppingCart from 'svelte-icons/fa/FaShoppingCart.svelte';
  import logo from '$lib/images/logo.png';
  import Themeswitcher from './themeswitcher.svelte';
  
  export let username = "Jane Smith";
  export let navItems = [];
  let userMenuOpen = false;
  
  function toggleUserMenu() {
    userMenuOpen = !userMenuOpen;
  }
  
  function handleClickOutside(event) {
    if (userMenuOpen && !event.target.closest('.user-menu')) {
      userMenuOpen = false;
    }
  }
  </script>
  
  <svelte:window on:click={handleClickOutside} />
  
  <header class="navbar bg-base-100 shadow-lg z-20 flex-wrap">
    <div class="navbar-start lg:flex-1">
      <div class="dropdown">
        <label tabindex="0" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {#each navItems as item}
            <li><a href={item.href}>{item.title}</a></li>
          {/each}
        </ul>
      </div>
      <a href="/auth" class="btn btn-ghost normal-case text-xl">
        <img src={logo} class="h-8 mr-2" alt="ShopGenie Logo" />
        Shop<span class="text-primary" style="margin-left: -0.1em;">Genie</span>
      </a>
    </div>
    <div class="navbar-center hidden lg:flex lg:flex-1 justify-center">
      <ul class="menu menu-horizontal px-1">
        {#each navItems as item}
          <li><a href={item.href}>{item.title}</a></li>
        {/each}
      </ul>
    </div>
    <div class="navbar-end lg:flex-1 justify-end">
      <a href="/auth/wish-list" class="btn btn-ghost btn-circle">
        <div class="w-6 h-6">
          <FaShoppingCart />
        </div>
      </a>
      <Themeswitcher/>
      <span class="mr-2 hidden sm:inline-block">{username}</span>
      <div class="dropdown dropdown-end user-menu ml-2">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar" on:click={toggleUserMenu}>
          <div class="w-10 rounded-full">
            <FaUser />
          </div>
        </label>
        {#if userMenuOpen}
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52" transition:fade={{ duration: 150 }}>
            <li>
              <a href="/auth/profile" class="justify-between">
                Profile
                <span class="badge"><FaUserCircle /></span>
              </a>
            </li>
            <li><a href="/auth/logout">Logout <span class="badge"><FaSignOutAlt /></span></a></li>
          </ul>
        {/if}
      </div>
    </div>
  </header>
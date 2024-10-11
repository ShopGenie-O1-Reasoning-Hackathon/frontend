<script lang="ts">
    import { enhance } from '$app/forms';
    import { fade, fly } from 'svelte/transition';
    import profile_pic from '$lib/images/profile-pic.svg';
    import { onMount } from 'svelte';
    import male from '$lib/images/male.svg';
    import female from '$lib/images/female.svg';
    
    export let data;
    let userInfo = data.authUser;
    let editing = false;
    let form;
    let isLoading = false;

    console.log("userid", userInfo.id);
    
    
    onMount(async () => {
        // await loadCountryFlag(userInfo.country);
    });
    
    // async function loadCountryFlag(country: string) {
    //     try {
    //         const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    //         if (response.ok) {
    //             const data = await response.json();
    //             countryFlag = data[0].flags.svg;
    //         } else {
    //             countryFlag = globe // Replace with your global flag SVG path
    //         }
    //     } catch (error) {
    //         console.error('Error fetching country flag:', error);
    //         countryFlag = globe; // Replace with your global flag SVG path
    //     }
    // }

    function toggleEdit() {
        editing = !editing;
    }
    
    function handleSubmit() {
        return async ({ result }) => {
            isLoading = true;
            if (result.type === 'success') {
                userInfo = result.data.user;
                // await loadCountryFlag(userInfo.country);
                editing = false;
            }
            isLoading = false;
        };
    }
</script>

<div class="bg-gradient-to-br from-base-200 to-base-300 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        <div class="relative h-48 sm:h-56 bg-primary">
            <img src={profile_pic} alt="Profile Picture" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-base-100 object-cover shadow-lg">
        </div>
        <div class="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            {#if !editing}
                <div in:fade="{{ duration: 300, delay: 300 }}" out:fade="{{ duration: 300 }}">
                    <h1 class="text-2xl sm:text-3xl font-bold text-center text-base-content mb-1">{userInfo.name}</h1>
                    <p class="text-lg sm:text-xl text-center text-primary mb-6">{userInfo.occupation}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
                        <div class="flex items-center text-base-content/80">
                            <svg class="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <span class="text-sm sm:text-base">{userInfo.email}</span>
                        </div>
                        <div class="flex items-center text-base-content/80">
                            <svg class="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span class="text-sm sm:text-base">{userInfo.city}</span>
                        </div>
                        <div class="flex items-center text-base-content/80">
                            {#if userInfo.gender === "male"}
                                <img src={male} alt={userInfo.gender} class="w-5 h-5 mr-3 object-cover">
                                <span class="text-sm sm:text-base">Man</span>
                            {:else}
                                <img src={female} alt={userInfo.gender} class="w-5 h-5 mr-3 object-cover">
                                <span class="text-sm sm:text-base">Woman</span>
                            {/if}
                            
                        </div>
                        <div class="flex items-center text-base-content/80">
                            <svg class="w-5 h-5 mr-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            <span class="text-sm sm:text-base">{userInfo.occupation}</span>
                        </div>
                    </div>
                    <button on:click={toggleEdit} class="w-full sm:w-auto mt-4 px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary-focus transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        Edit Profile
                    </button>
                </div>
            {:else}
                <form 
                    method="POST" 
                    action="?/updateProfile" 
                    use:enhance={handleSubmit} 
                    bind:this={form}
                    in:fly="{{ y: 20, duration: 300, delay: 300 }}"
                    out:fly="{{ y: -20, duration: 300 }}"
                    class="space-y-4"
                >
                    <div>
                        <label for="name" class="block text-sm font-medium text-base-content/80">Name</label>
                        <input type="text" id="name" name="name" bind:value={userInfo.name} class="mt-1 block w-full rounded-md border-base-300 bg-base-200 text-base-content shadow-sm focus:border-primary focus:ring-primary">
                    </div>
                    <div>
                        <label for="occupation" class="block text-sm font-medium text-base-content/80">Occupation</label>
                        <input type="text" id="occupation" name="occupation" bind:value={userInfo.occupation} class="mt-1 block w-full rounded-md border-base-300 bg-base-200 text-base-content shadow-sm focus:border-primary focus:ring-primary">
                    </div>
                    <div>
                        <label for="city" class="block text-sm font-medium text-base-content/80">City</label>
                        <input type="text" id="city" name="city" bind:value={userInfo.city} class="mt-1 block w-full rounded-md border-base-300 bg-base-200 text-base-content shadow-sm focus:border-primary focus:ring-primary">
                    </div>
                    <!-- <div>
                        <label for="gender" class="block text-sm font-medium text-base-content/80">Gender</label>
                        <input type="text" id="gender" name="gender" bind:value={userInfo.gender} class="mt-1 block w-full rounded-md border-base-300 bg-base-200 text-base-content shadow-sm focus:border-primary focus:ring-primary">
                    </div> -->
                    <input type="hidden" name="id" value={userInfo.id}>
                    <div class="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                        <button type="button" on:click={toggleEdit} class="w-full sm:w-auto px-4 py-2 border border-base-300 rounded-md text-sm font-medium text-base-content hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            Cancel
                        </button>
                        <button type="submit" class="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-content bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative">
                            {#if isLoading}
                                <span class="absolute inset-0 flex items-center justify-center">
                                    <svg class="animate-spin h-5 w-5 text-primary-content" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                                </span>
                                <span class="opacity-0">Save Changes</span>
                            {:else}
                                Save Changes
                            {/if}
                        </button>
                    </div>
                </form>
            {/if}
        </div>
    </div>
</div>
<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';
	import FaBook from 'svelte-icons/fa/FaBook.svelte';
	import FaCalendarAlt from 'svelte-icons/fa/FaCalendarAlt.svelte';
	import FaTasks from 'svelte-icons/fa/FaTasks.svelte';
	import FaShoppingCart from 'svelte-icons/fa/FaShoppingCart.svelte';
	import FaArrowRight from 'svelte-icons/fa/FaArrowRight.svelte';
	import Navbar from '$lib/components/navbar_no_auth.svelte';
	import Footer from '$lib/components/short_footer.svelte';
	import consumer_signup from '$lib/images/search.png';
	import logo from '$lib/images/logo.png';

	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { z } from 'zod';

	export let data: PageData;

	const userSchema = z.object({
		name: z
			.string({ required_error: 'Your Name is required' })
			.min(3, { message: 'At least 3 characters' })
			.max(256, { message: 'At most 256 characters' }),
		email: z
			.string({ required_error: 'Your Email is required' })
			.min(1, { message: 'Email is required' })
			.max(256, { message: 'Email must be less than 256 characters' })
			.email({ message: 'Email must be a valid email address' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(32, { message: 'Password must be less than 32 characters' })
			.regex(new RegExp('.*[A-Z].*'), 'Password must contain at least one uppercase character')
			.regex(new RegExp('.*[a-z].*'), 'Password must contain at least one lowercase character')
			.regex(new RegExp('.*\\d.*'), 'Password must contain at least one number')
			.regex(
				new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
				'Password must contain at least one special character'
			)
			.trim(),
		gender: z.enum(['male', 'female'], { required_error: 'Gender is required' })
	});

	const { form, errors, enhance, constraints, message } = superForm(data.form, {
		validators: userSchema
	});

	let isLoading = false;

	async function onSubmit() {
		isLoading = true;
		setTimeout(() => {
			isLoading = false;
		}, 5000);
	}
</script>

<div class="flex flex-col min-h-screen bg-base-200">
	<Navbar />
	<section class="flex-1 flex items-center justify-center p-4">
		<div class="card w-full max-w-5xl bg-base-100 shadow-xl">
			<div class="grid md:grid-cols-2 gap-6">
				<div class="bg-base-200 flex items-center justify-center p-8 rounded-l-xl">
					<div class="text-center">
						<div class="flex items-center justify-center mb-9">
							<img src={consumer_signup} alt="Signup Logo" class="max-w-[250px] w-full" />
						</div>
						<a href="/" class="text-4xl font-bold">
							Shop<span class="text-primary">Genie</span>
						</a>
						<p class="mt-4 text-base-content/70">Your personal shopping assistant</p>
					</div>
				</div>
				<div class="flex items-center justify-center p-8">
					<div class="w-full max-w-sm">
						<form
							use:enhance
							action="?/register"
							method="post"
							class="space-y-6"
							on:submit={onSubmit}
						>
							
							
							<div class="flex items-center justify-center mb-4">
								<img src={logo} class="mr-2 h-20" alt="ShopGenie Logo" />
							</div>
							<h1 class="text-2xl font-bold text-center">🔑 Create Your Account</h1>

							{#if $message}
								<div class="alert {$message === 'SignUp Successful. Check Inbox' ? 'alert-success' : 'alert-error'} shadow-lg">
									<div>
										<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
										<span>{$message}</span>
									</div>
								</div>
							{/if}

							<div class="form-control">
								<label for="name" class="label">
									<span class="label-text">Your name*</span>
								</label>
								<div class="relative">
									<input
										type="text"
										placeholder="Enter your name"
										name="name"
										id="name"
										disabled={isLoading}
										bind:value={$form.name}
										class="input input-bordered w-full pl-10 {$errors.name ? 'input-error' : ''}"
									/>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content opacity-70">
										<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/>
									</svg>
								</div>
								{#if $errors.name}
									<label class="label">
										<span class="label-text-alt text-error">{$errors.name[0]}</span>
									</label>
								{/if}
							</div>

							<div class="form-control">
								<label for="email" class="label">
									<span class="label-text">Your Email*</span>
								</label>
								<div class="relative">
									<input
										type="email"
										placeholder="email@domain.com"
										name="email"
										id="email"
										disabled={isLoading}
										bind:value={$form.email}
										class="input input-bordered w-full pl-10 {$errors.email ? 'input-error' : ''}"
									/>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content opacity-70">
										<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
										<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
									</svg>
								</div>
								{#if $errors.email}
									<label class="label">
										<span class="label-text-alt text-error">{$errors.email[0]}</span>
									</label>
								{/if}
							</div>

							<div class="form-control">
								<label for="password" class="label">
									<span class="label-text">Enter Password*</span>
								</label>
								<div class="relative">
									<input
										type="password"
										name="password"
										id="password"
										disabled={isLoading}
										bind:value={$form.password}
										class="input input-bordered w-full pl-10 {$errors.password ? 'input-error' : ''}"
									/>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content opacity-70">
										<path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd"/>
									</svg>
								</div>
								{#if $errors.password}
									<label class="label">
										<span class="label-text-alt text-error">{$errors.password[0]}</span>
									</label>
								{/if}
							</div>

							<div class="form-control">
								<label for="gender" class="label">
									<span class="label-text">Gender*</span>
								</label>
								<select
									name="gender"
									id="gender"
									disabled={isLoading}
									bind:value={$form.gender}
									class="select select-bordered w-full {$errors.gender ? 'select-error' : ''}"
								>
									<option value="" disabled selected>Select your gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</select>
								{#if $errors.gender}
									<label class="label">
										<span class="label-text-alt text-error">{$errors.gender[0]}</span>
									</label>
								{/if}
							</div>

							<div class="mt-6">
								<a href="/login" class="link link-primary block text-center mb-4">Already Have an Account? Sign In</a>
								<button type="submit" class="btn btn-primary w-full" disabled={isLoading}>
									{#if isLoading}
										<span class="loading loading-spinner"></span>
									{/if}
									Sign Up
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>
	<Footer />
</div>

<style>
	:global(.icon) {
		width: 100%;
		height: 100%;
	}
	
	:global(body) {
		font-family: 'Roboto', sans-serif;
	}
</style>
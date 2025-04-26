<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		signUp,
		signOut,
		session,
		signUpWithGoogle
	} from '$lib/clerk/client';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	import { onMount } from 'svelte';

	let isLoading = $state(false);
	let isLoadingGoogle = $state(false);
	const disabled = $derived(isLoading || isLoadingGoogle);
	let error = $state('');

	function separatedName(name: string) {
		const nameParts = name.trim().split(' ');
		const firstName = nameParts[0];
		const lastName = nameParts.slice(1).join(' ');

		return {
			firstName: firstName
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(''),
			lastName: lastName
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')
		};
	}

	async function handleSignUp(event: Event) {
		event.preventDefault();
		isLoading = true;
		error = '';

		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const emailAddress = formData.get('email') as string;
		const password = formData.get('password') as string;
		const name = formData.get('name') as string;
		const { firstName, lastName } = separatedName(name);

		if ($session) {
			await signOut();
		}

		signUp({ firstName, lastName, emailAddress, password })
			.then(async (resp) => {
				await resp.prepareEmailAddressVerification({
					strategy: 'email_link',
					redirectUrl: 'http://localhost:5173/auth/signup/register'
				});
				goto('/auth/signup/confirm');
			})
			.catch((err) => {
				error = err?.message;
				console.error(error);
			})
			.finally(() => (isLoading = false));
	}

	onMount(async () => {
		if ($session) {
			await signOut();
		}
	});

	async function handleSignUpWithGoogle() {
		isLoadingGoogle = true;
		if ($session) {
			await signOut();
		}
		await signUpWithGoogle(() => (isLoadingGoogle = false));
	}

	$effect(() => {
		if (page.url.searchParams.get('error') === 'external_account_exists') {
			error = 'An account with this email already exists. Please sign in.';
		}
		if (page.url.searchParams.get('error') === 'callback_error') {
			error =
				'There was an error while trying to sign you up. Please try again.';
		}
	});
</script>

<div class="flex w-full flex-col">
	<div class="flex h-16 w-full items-center justify-center bg-neutral-100">
		<div class="flex w-279 flex-col gap-2">
			<nav class="flex items-center gap-2">
				<a href="/#" class="text-sm text-neutral-500 hover:underline"
					>eCommerce</a
				>
				<span class="px-2.25 py-1.5">
					<img
						src="/icons/arrow-right.svg"
						alt="Arrow Right"
						height="12px"
						width="6px"
					/>
				</span>
				<span class="text-sm font-medium text-neutral-900">Sign up</span>
			</nav>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center py-12">
		<div class="flex w-80 flex-col">
			<button
				{disabled}
				onclick={handleSignUpWithGoogle}
				type="button"
				class="flex h-11 w-80 cursor-pointer items-center justify-center gap-3 border border-neutral-300 text-sm font-medium text-neutral-500 disabled:cursor-not-allowed"
			>
				{#if isLoadingGoogle}
					<Spinner class="size-5 text-neutral-900" />
				{/if}

				<div class="flex items-center gap-3">
					<img
						src="/icons/google.svg"
						alt="Google icon"
						width="16px"
						height="16px"
					/>

					Continue with Google
				</div>
			</button>

			<div class="flex items-center justify-center gap-3 pt-8 pb-8.5">
				<span class="h-0.25 w-full bg-neutral-100"></span>
				<span class="text-sm font-medium text-neutral-500">OR</span>
				<span class="h-0.25 w-full bg-neutral-100"></span>
			</div>
		</div>
		<form class="flex w-80 flex-col" onsubmit={handleSignUp} autocomplete="off">
			<div class="flex flex-col gap-3.5">
				<div class="flex flex-col gap-0.5">
					<label for="name" class="text-sm font-medium text-neutral-600"
						>Name</label
					>
					<input
						autocomplete="off"
						{disabled}
						name="name"
						id="name"
						type="text"
						placeholder="Enter your fullname "
						class="h-11.25 border border-neutral-300 px-4 text-sm font-medium text-neutral-500 outline-none"
					/>
				</div>
				<div class="flex flex-col gap-0.5">
					<label for="email" class="text-sm font-medium text-neutral-600"
						>E-mail</label
					>
					<input
						autocomplete="off"
						{disabled}
						name="email"
						id="email"
						type="text"
						placeholder="Enter your e-mail"
						class="h-11.25 border border-neutral-300 px-4 text-sm font-medium text-neutral-500 outline-none"
					/>
				</div>
				<div class="flex flex-col gap-0.5">
					<label for="password" class="text-sm font-medium text-neutral-600"
						>Password</label
					>
					<input
						{disabled}
						autocomplete="off"
						name="password"
						id="password"
						type="password"
						placeholder="Enter your password"
						class="h-11.25 border border-neutral-300 px-4 text-sm font-medium text-neutral-500 outline-none"
					/>
				</div>
			</div>
			<p class="my-6 mb-6 self-end text-xs text-neutral-600">
				By creating an account you agree with our Terms of Service, Privacy
				Policy,
			</p>
			<div class="flex w-full flex-col gap-1">
				<button
					{disabled}
					type="submit"
					class="flex h-11 cursor-pointer items-center justify-center gap-3 bg-black text-sm font-medium text-white disabled:cursor-not-allowed"
				>
					{#if isLoading}
						<Spinner class="size-5 text-white" />
					{:else}
						Create account
					{/if}
				</button>
				{#if error}
					<p class="text-xs text-red-500">{error}</p>
				{/if}
			</div>
			<a
				href="/auth/login"
				class="mt-6 self-center text-xs text-neutral-600 hover:underline"
				>Already have an account? Log in
			</a>
		</form>
	</div>
</div>

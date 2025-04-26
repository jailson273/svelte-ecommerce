<script lang="ts">
	import { page } from '$app/state';
	import { clerk, signIn, signInWithGoogle, signOut } from '$lib/clerk/client';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	import { get } from 'svelte/store';

	const _clerk = get(clerk);

	let error = $state('');
	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let isLoadingGoogle = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		isLoading = true;
		error = '';

		await signOut();

		try {
			const resp = await signIn({
				strategy: 'password',
				password,
				identifier: email
			});

			await _clerk?.setActive({
				session: resp.createdSessionId,
				redirectUrl: page.url.searchParams.get('redirect') || '/'
			});
		} catch (err: any) {
			error = err?.message;
		} finally {
			isLoading = false;
		}
	}

	async function handleLoginWithGoogle(e: Event) {
		e.preventDefault();
		isLoadingGoogle = true;
		error = '';

		await signOut();

		try {
			await signInWithGoogle();
		} catch (err: any) {
			error = err?.message;
		} finally {
			isLoadingGoogle = false;
		}
	}

	$effect(() => {
		if (page.url.searchParams.get('error') === 'external_account_not_found') {
			error = 'This account is not registered.';
		}

		if (page.url.searchParams.get('error') === 'callback_error') {
			error = 'Error on login in your account, Please try again.';
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
				<span class="text-sm font-medium text-neutral-900">Login</span>
			</nav>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center py-12">
		<button
			onclick={handleLoginWithGoogle}
			disabled={isLoading || isLoadingGoogle}
			type="submit"
			class="flex h-11 w-80 cursor-pointer items-center justify-center gap-3 border border-neutral-300 text-sm font-medium text-neutral-500"
		>
			{#if isLoadingGoogle}
				<Spinner class="size-5 text-neutral-900" />
			{/if}
			<img
				src="/icons/google.svg"
				alt="Google icon"
				width="16px"
				height="16px"
			/>
			Continue with Google
		</button>
		<form class="flex w-80 flex-col" onsubmit={handleLogin}>
			<div class="flex items-center justify-center gap-3 pt-8 pb-8.5">
				<span class="h-0.25 w-full bg-neutral-100"></span>
				<span class="text-sm font-medium text-neutral-500">OR</span>
				<span class="h-0.25 w-full bg-neutral-100"></span>
			</div>

			<div class="flex flex-col gap-3.5">
				<div class="flex flex-col gap-0.5">
					<label for="email" class="text-sm font-medium text-neutral-600"
						>E-mail</label
					>
					<input
						disabled={isLoading || isLoadingGoogle}
						name="email"
						id="email"
						bind:value={email}
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
						disabled={isLoading || isLoadingGoogle}
						bind:value={password}
						name="password"
						id="password"
						type="password"
						placeholder="Enter your password"
						class="h-11.25 border border-neutral-300 px-4 text-sm font-medium text-neutral-500 outline-none"
					/>
				</div>
			</div>
			<a
				href="/auth/forgot"
				class="mt-4 mb-6 self-end text-xs text-neutral-600 hover:underline"
				>Forgot Password?</a
			>
			<div class="flex flex-col gap-1">
				<button
					disabled={isLoading || isLoadingGoogle}
					type="submit"
					class="flex h-11 cursor-pointer items-center justify-center gap-3 bg-black text-sm font-medium text-white"
				>
					{#if isLoading}
						<Spinner class="size-5" />
					{/if}
					Login
				</button>
				{#if error}
					<p class="self-center text-xs text-red-500">{error}</p>
				{/if}
			</div>
			<a
				href="/auth/signup"
				class="mt-6 self-center text-xs text-neutral-600 hover:underline"
				>Don't have an account? Sign up</a
			>
		</form>
	</div>
</div>

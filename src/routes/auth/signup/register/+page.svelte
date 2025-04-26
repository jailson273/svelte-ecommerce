<!-- routes/auth/signup/callback/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { clerk } from '$lib/clerk/client';
	import { get } from 'svelte/store';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';

	let error = $state('');
	let loading = $state(true);

	onMount(async () => {
		const _clerk = get(clerk);
		if (!_clerk) {
			error = 'Error on regiter yout accouny, try again.';
			loading = false;
			return;
		}

		try {
			console.log(
				'_clerk',
				_clerk?.client?.signUp?.verifications?.externalAccount?.error
			);

			if (_clerk.user) {
				const form = new FormData();
				form.set('clerkId', _clerk.user.id);

				form.set(
					'email',
					_clerk.user.primaryEmailAddress?.emailAddress as string
				);
				form.set('name', _clerk.user.firstName + ' ' + _clerk.user.lastName);

				const resp = await fetch('/api/user', {
					method: 'POST',
					body: form
				});

				if (!resp.ok) {
					error = 'Error on register your account, try again.';
					return;
				}
				goto('/');
			} else {
				if (
					_clerk?.client?.signUp?.verifications?.externalAccount?.error
						?.code === 'external_account_exists'
				) {
					error = 'This email is already registered.';
					goto('/auth/signup/?error=external_account_exists');
				}
			}
		} catch {
			error = 'Error on register your account, try again.';
			goto('/auth/signup/?error=callback_error');
		} finally {
			loading = false;
		}
	});
</script>

<div class="flex h-screen w-full items-center justify-center">
	{#if loading}
		<Spinner class="size-10 text-neutral-900" />
	{/if}
	{#if error}
		<p class="text-xs text-red-500">{error}</p>
	{/if}
</div>

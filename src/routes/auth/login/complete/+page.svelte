<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { clerk } from '$lib/clerk/client';
	import { get } from 'svelte/store';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';

	onMount(() => {
		const _clerk = get(clerk);
		if (_clerk?.user) {
			goto('/');
			return;
		}

		if (
			_clerk?.client?.signIn?.firstFactorVerification?.error?.code ===
			'external_account_not_found'
		) {
			goto('/auth/login/?error=external_account_not_found');
		} else {
			goto('/auth/login/?error=callback_error');
			return;
		}
	});
</script>

<div class="flex h-50 w-full items-center justify-center">
	<Spinner class="size-6 text-black" />
</div>

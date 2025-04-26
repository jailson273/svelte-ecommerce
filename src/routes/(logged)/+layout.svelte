<script lang="ts">
	import { goto } from '$app/navigation';
	import { clerk } from '$lib/clerk/client';
	import { get } from 'svelte/store';

	const _clerk = get(clerk);

	const { children } = $props();

	$effect(() => {
		if (!_clerk?.isSignedIn) {
			goto('/auth/login');
		}
	});
</script>

{@render children()}

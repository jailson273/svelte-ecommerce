<script lang="ts">
	import { goto } from '$app/navigation';
	import { clerk } from '$lib/clerk/client';
	import { get } from 'svelte/store';

	const { children } = $props();

	let _clerk = get(clerk);

	$effect(() => {
		if (_clerk?.isSignedIn) {
			goto('/');
		}
	});
</script>

{@render children()}

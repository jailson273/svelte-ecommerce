<!-- src/lib/components/ClerkAuth.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { initClerk, isLoaded } from '$lib/clerk/client';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

	const { children } = $props();

	onMount(async () => {
		try {
			await initClerk(PUBLIC_CLERK_PUBLISHABLE_KEY);
		} catch (error) {
			console.error('Falha ao carregar o Clerk:', error);
		}
	});
</script>

{#if $isLoaded}
	{@render children()}
{/if}

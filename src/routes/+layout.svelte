<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header/Header.svelte';
	import Footer from '$lib/components/Footer/Footer.svelte';
	import { type Snippet } from 'svelte';
	import ClerkProvider from '$lib/clerk/ClerkProvider/ClerkProvider.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<ClerkProvider>
	<main class="flex h-screen w-full flex-col">
		<Header />
		<div class="flex w-full flex-col">
			{@render children()}
		</div>
		<Footer />
	</main>
</ClerkProvider>

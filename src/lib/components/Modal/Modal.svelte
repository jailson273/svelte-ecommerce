<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		isOpen,
		onClose
	}: { children: Snippet; isOpen: boolean; onClose: VoidFunction } = $props();
</script>

{#if isOpen}
	<div class="fixed top-1/2 left-1/2 z-20 -translate-1/2 bg-white p-6">
		<button class="absolute top-0 right-0 cursor-pointer p-2" onclick={onClose}>
			<img src="/icons/close.svg" width="16px" height="16px" alt="Close" />
		</button>
		{@render children()}
	</div>
	<div class="fixed inset-0 z-10 h-screen w-full bg-black/50"></div>
{/if}

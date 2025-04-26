<script lang="ts">
	const { loading }: { loading: boolean } = $props();
</script>

{#if loading}
	<div class="fixed top-0 left-0 z-10 h-screen w-full bg-black/20">
		<div
			class="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-spin items-center justify-center rounded-full border-4 border-black border-b-black/10 bg-transparent"
		></div>
	</div>
{/if}

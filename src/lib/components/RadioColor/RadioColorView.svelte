<script lang="ts">
	const { hex }: { hex: string } = $props();
</script>

<div class="size-5 rounded-full p-0.5">
	<div
		class="h-full w-full rounded-full border border-neutral-400"
		style="background-color: {hex}"
	></div>
</div>

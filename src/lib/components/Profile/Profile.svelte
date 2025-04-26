<script lang="ts">
	const { initials }: { initials: string } = $props();
</script>

<div
	class="flex size-12 items-center justify-center rounded-full bg-blue-50 text-sm text-blue-500 uppercase"
>
	{initials}
</div>

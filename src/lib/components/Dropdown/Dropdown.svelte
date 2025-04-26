<script lang="ts">
	interface Option {
		name: string;
		value: string;
	}

	const {
		selected,
		placeholder,
		options,
		onselect
	}: {
		onselect: (value: string) => void;
		selected?: string;
		placeholder: string;
		options: Option[];
	} = $props();

	let isOpen = $state(false);
</script>

<div class="relative flex min-w-35 justify-end">
	<button
		onclick={() => (isOpen = !isOpen)}
		class="flex cursor-pointer items-center justify-end gap-3 text-xs font-medium text-neutral-500"
	>
		{placeholder}
		{#if selected}
			({options.find(({ value }) => value === selected)?.name})
		{/if}

		<img
			src="/icons/chevron-down.svg"
			width="12px"
			height="6px"
			alt="Chevron Down"
		/>
	</button>
	{#if isOpen}
		<div
			class="absolute top-5 right-0 z-10 flex w-full flex-col gap-2 overflow-hidden bg-white shadow"
		>
			{#each options as { name, value } (value)}
				<button
					onclick={() => {
						onselect(value);
						isOpen = false;
					}}
					class="flex w-full cursor-pointer items-center px-4 py-2 text-sm text-neutral-500 transition-all duration-300 hover:bg-neutral-300"
					>{name}</button
				>
			{/each}
		</div>
	{/if}
</div>

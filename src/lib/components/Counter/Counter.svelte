<script lang="ts">
	const { onchange, init = 1 }: { onchange: (value: number) => void; init?: number } = $props();

	let count = $state(init);

	const increment = () => {
		count++;
		onchange(count);
	};
	const decrement = () => {
		if (count > 1) {
			count--;
			onchange(count);
		}
	};
</script>

<div class="flex h-11 w-42 items-center justify-between  border border-neutral-100 px-4">
	<button class="w-fit cursor-pointer" onclick={decrement}>
		<img src="/icons/minus.svg" alt="Minus" class="size-5" />
	</button>
	<span class="flex size-5 items-center justify-center text-sm font-medium text-neutral-800"
		>{count}</span
	>
	<button class="w-fit cursor-pointer" onclick={increment}>
		<img src="/icons/plus.svg" alt="Plus" class="size-5" />
	</button>
</div>

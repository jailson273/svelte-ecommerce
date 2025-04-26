<script lang="ts">
	import type { Product } from '$lib/models/Product';

	let index = $state(0);

	let { product }: { product: Product } = $props();

	const images = $derived(product.images);

	function goToPrev() {
		index = (index - 1 + images.length) % images.length;
	}

	function goToNext() {
		index = (index + 1) % images.length;
	}
</script>

<div
	class="relative flex h-143.5 w-133.5 items-center justify-center bg-neutral-100"
>
	<img
		src={images[index]}
		alt={product.name}
		class=" pointer-events-none h-101 w-72 select-none"
	/>
	<div class="absolute bottom-8 flex items-center justify-center gap-2">
		{#each images as _, i}
			<button
				aria-label={images[index]}
				type="button"
				class={`size-3 cursor-pointer rounded-full bg-neutral-200 shadow transition-all  ${index === i ? 'bg-neutral-900' : ''}`}
				onclick={() => (index = i)}
			></button>
		{/each}
	</div>
	<div class="absolute top-2 left-2 text-xs text-gray-500 uppercase">
		{product.category[0].name}
	</div>
	<button
		class="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 shadow backdrop-blur-sm transition-colors hover:bg-white/50"
		onclick={goToPrev}
		aria-label="Imagem anterior"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 19l-7-7 7-7"
			/>
		</svg>
	</button>

	<button
		class="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 shadow backdrop-blur-sm transition-colors hover:bg-white/50"
		onclick={goToNext}
		aria-label="Próxima imagem"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M9 5l7 7-7 7"
			/>
		</svg>
	</button>
</div>

<script lang="ts">
	let {
		id,
		name,
		inStock,
		price,
		image,
		category
	}: {
		id: number;
		category: string;
		name: string;
		inStock: boolean;
		price: number;
		image: string;
	} = $props();
	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price);
	}
</script>

<div class="flex flex-col gap-3 px-3.5 py-4">
	<a href="/shop/{id}" class="relative">
		<img src={image} alt={name} />
		<p class="absolute bottom-2 left-2 text-xs text-gray-500 uppercase">
			{category}
		</p>
	</a>

	<p class="text-sm font-medium text-neutral-900">{name}</p>

	<span class="flex items-center justify-start gap-4">
		<span
			class="flex h-7 w-22.25 items-center justify-center border border-neutral-100 text-xs font-medium text-neutral-900 uppercase"
		>
			{inStock ? 'In Stock' : 'No Stock'}
		</span>
		<p class="text-sm text-neutral-600">{formatPrice(price)}</p>
	</span>
</div>

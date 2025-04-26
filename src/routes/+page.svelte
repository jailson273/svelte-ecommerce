<script lang="ts">
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import { urlFilteredSubscribe } from '$lib/store/shop/subscribes/shop.subscribe.js';
	let urlFiltered = $state('');
	urlFilteredSubscribe((prev) => (urlFiltered = prev));

	let { data } = $props();
</script>

<div class="flex w-full items-center justify-center gap-106.75 bg-neutral-100">
	<div class="flex flex-col gap-3">
		<h2 class="text-[32px] font-semibold text-neutral-800">
			Fresh Arrivals Online
		</h2>
		<p class="text-sm text-neutral-600">
			Discover Our Newest Collection Today.
		</p>
		<a
			href={urlFiltered}
			class="mt-9 flex h-11 w-45.75 items-center justify-center gap-2.75 bg-black text-white"
			>View Collection <img
				src="/icons/arrow-right-2.svg"
				alt="Arrow right"
				width="13px"
				height="12px"
			/>
		</a>
	</div>
	<div
		class="relative mt-16.5 flex h-85 w-85 justify-end rounded-full bg-neutral-200"
	>
		<img
			src="/icons/start.svg"
			alt="Start"
			width="38px"
			height="37.32px"
			class="absolute top-1 left-3 z-10"
		/>
		<img
			src="/img/hero.png"
			alt="Hero"
			width="255px"
			height="382px"
			class="absolute -top-9"
		/>
	</div>
</div>
<div
	class="mt-22 mb-18 flex h-66.5 w-full items-center justify-center gap-13.5"
>
	<div class="flex w-82 flex-col items-center justify-center gap-3">
		<span
			class="flex size-12 items-center justify-center rounded-full bg-neutral-100"
		>
			<img
				src="/icons/delivery.svg"
				width="24px"
				height="24px"
				alt="Shipping"
			/>
		</span>
		<h3 class="mt-3 text-[16px] font-semibold text-neutral-800">
			Free Shipping
		</h3>
		<p class="w-68 self-center text-center text-sm text-neutral-500">
			Upgrade your style today and get FREE shipping on all orders! Don't miss
			out.
		</p>
	</div>
	<div class="flex w-82 flex-col items-center justify-center gap-3">
		<span
			class="flex size-12 items-center justify-center rounded-full bg-neutral-100"
		>
			<img src="/icons/badge.svg" width="24px" height="24px" alt="Badge" />
		</span>
		<h3 class="mt-3 text-[16px] font-semibold text-neutral-800">
			Satisfaction Guarantee
		</h3>
		<p class="w-68 self-center text-center text-sm text-neutral-500">
			Shop confidently with our Satisfaction Guarantee: Love it or get a refund.
		</p>
	</div>
	<div class="flex w-82 flex-col items-center justify-center gap-3">
		<span
			class="flex size-12 items-center justify-center rounded-full bg-neutral-100"
		>
			<img src="/icons/security.svg" width="24px" height="24px" alt="Badge" />
		</span>
		<h3 class="mt-3 text-[16px] font-semibold text-neutral-800">
			Secure Payment
		</h3>
		<p class="w-68 self-center text-center text-sm text-neutral-500">
			Your security is our priority. Your payments are secure with us.
		</p>
	</div>
</div>
<div class="mb-42 flex flex-col items-center justify-center gap-20">
	<div class="flex flex-col gap-2">
		<p class="text-xs font-medium text-neutral-300 uppercase">Shop Now</p>
		<h3 class="text-2xl font-bold text-neutral-800">Best Selling</h3>
	</div>
	<div class="flex items-center gap-5">
		{#each data.products as { id, inStock, price, name, images, category } (id)}
			<ProductCard
				{id}
				{name}
				{price}
				category={category[0].name}
				inStock={Boolean(inStock)}
				image={images[0]}
			/>
		{:else}
			<p class="mt-4 col-span-3 py-10 text-center text-neutral-500">
				No products found. Please try your search again!
			</p>
		{/each}
	</div>
</div>
<div
	class="flex w-full items-center justify-center gap-91.5 bg-neutral-100 pt-13 pb-18.25"
>
	<div class="flex w-115.5 flex-col gap-6">
		<h2 class="text-2xl font-bold text-neutral-900">
			Browse Our Fashion Paradise!
		</h2>
		<p class="text-sm text-neutral-500">
			Step into a world of style and explore our diverse collection of clothing
			categories.
		</p>
		<a
			href={urlFiltered}
			class="mt-9 flex h-11 w-45.75 items-center justify-center gap-2.75 bg-black text-white"
			>Start Browsing <img
				src="/icons/arrow-right-2.svg"
				alt="Arrow right"
				width="13px"
				height="12px"
			/>
		</a>
	</div>
	<img src="/img/category.png" alt="Category" width="225px" height="311px" />
</div>

<div class="mt-38 mb-48 flex flex-col items-center justify-center gap-12">
	<span class="flex items-center justify-start gap-4">
		<span
			class="flex h-7 w-22.25 items-center justify-center border border-neutral-100 text-xs font-medium text-neutral-900"
		>
			Featured
		</span>
		<p class="text-sm text-neutral-600">Latest</p>
	</span>
	<div class="flex items-center gap-5">
		{#each data.products as { id, inStock, price, name, images, category } (id)}
			<ProductCard
				{id}
				{name}
				{price}
				category={category[0].name}
				inStock={Boolean(inStock)}
				image={images[0]}
			/>
		{:else}
			<p class="mt-4 col-span-3 py-10 text-center text-neutral-500">
				No products found. Please try your search again!
			</p>
		{/each}
	</div>
</div>

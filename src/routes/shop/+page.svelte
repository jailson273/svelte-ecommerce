<script lang="ts">
	import Checkbox from '$lib/components/Checkbox/Checkbox.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import RadioColor from '$lib/components/RadioColor/RadioColor.svelte';
	import RadioSize from '$lib/components/RadioSize/RadioSize.svelte';
	import Slider from '$lib/components/Slider/Slider.svelte';
	import { page } from '$app/state';
	import { cleanObject } from '$lib/utils/cleanObject.js';
	import { goto } from '$app/navigation';
	import { debounce } from '$lib/utils/debounce.js';
	import { urlFilteredUpdate } from '$lib/store/shop/updates/urlFiltered.update.js';
	import RadioColorView from '$lib/components/RadioColor/RadioColorView.svelte';
	import { isNaNConvert } from '$lib/utils/isNaNConvert.js';
	import Tag from '$lib/components/Tag/Tag.svelte';
	import Dropdown from '$lib/components/Dropdown/Dropdown.svelte';

	interface Filter {
		page: number;
		perPage: number;
		searchTerm: string;
		colors: string[];
		sizes: string[];
		categories: string[];
		price: number;
		orderBy: string;
	}

	let { data } = $props();

	let count = $derived(data.products.count);
	let items = $derived(data.products.items);
	let totalPages = $derived(data.products.totalPages);
	let filters = $state<Filter>({
		page: 1,
		perPage: 9,
		categories: [],
		colors: [],
		sizes: [],
		price: 0,
		searchTerm: '',
		orderBy: ''
	});

	let visibleRange = $derived.by(() => {
		const range = 5;
		const diff = 3;
		const currentPage = filters.page;
		let start = currentPage - diff;

		if (totalPages <= range) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		if (currentPage <= range - diff) {
			start = 1;
		}

		if (currentPage >= totalPages - diff) {
			start = totalPages - diff * 2;
		}

		return Array.from({ length: range }, (_, i) => start + i);
	});

	$effect(() => {
		if (page.url.searchParams.size > 0) {
			filters = {
				page: isNaNConvert(page.url.searchParams.get('page'), 1),
				perPage: isNaNConvert(page.url.searchParams.get('perPage'), 9),
				categories: page.url.searchParams.get('categories')?.split(',') || [],
				colors: page.url.searchParams.get('colors')?.split(',') || [],
				sizes: page.url.searchParams.get('sizes')?.split(',') || [],
				price: isNaNConvert(page.url.searchParams.get('price')),
				searchTerm: page.url.searchParams.get('searchTerm') || '',
				orderBy: page.url.searchParams.get('orderBy') || ''
			};
		}
	});

	const filtered = $derived(cleanObject(filters));

	const counterFilters = $derived(Object.keys(filtered).length);

	function handleClearFilter() {
		filters.page = 1;
		filters.perPage = 9;
		filters.categories = [];
		filters.colors = [];
		filters.sizes = [];
		filters.price = 0;
		filters.searchTerm = '';
		filters.orderBy = '';

		const url = new URL(page.url);
		url.search = '';

		urlFilteredUpdate(url.href);
		goto(url.href, {
			invalidate: ['app:shop:products']
		});
	}

	function handleFilterChange(params: Partial<Filter>) {
		filters = { ...filters, ...params };
		if (!params.page) {
			filters.page = 1;
		}
		const url = new URL(page.url);
		url.search = '';
		const cleanedFilters = cleanObject(filters);
		const validParams = Object.entries(cleanedFilters).filter(([_, value]) => {
			if (typeof value === 'number') return value > 0;
			if (typeof value === 'string') return value.trim() !== '';
			if (Array.isArray(value)) return value.length > 0;
			return false;
		});

		validParams.forEach(([key, value]) => {
			if (Array.isArray(value)) {
				url.searchParams.set(key, value.join(','));
			} else {
				url.searchParams.set(key, String(value));
			}
		});

		urlFilteredUpdate(url.href);
		goto(url.href, {
			invalidate: ['app:shop:products']
		});
	}
	const updatePriceFilter = debounce(handleFilterChange, 500);

	urlFilteredUpdate(page.url.href);
</script>

<div class="flex h-16 w-full items-center justify-center bg-neutral-100">
	<nav class="flex h-16 w-279 items-center gap-2">
		<a href="/" class="text-sm text-neutral-500 hover:underline">eCommerce</a>
		<span class="px-2.25 py-1.5">
			<img
				src="/icons/arrow-right.svg"
				alt="Arrow Right"
				height="12px"
				width="6px"
			/>
		</span>
		<span class="text-sm font-medium text-neutral-900">Shop</span>
	</nav>
</div>
<div class="mx-auto flex w-279 justify-center gap-5.5 py-8">
	<div
		class="flex h-fit w-65 flex-col gap-10 border border-neutral-200 px-7 pt-6 pb-12"
	>
		<div class="flex w-50 flex-col gap-4">
			<h2 class="text-sm font-medium text-neutral-900">Category</h2>
			<div class="flex w-full flex-col">
				{#each data.filters.categories as { name, id } (id)}
					<div class="flex h-12.25 items-center border-b border-neutral-200">
						<Checkbox
							type="checkbox"
							checked={filters.categories.includes(name)}
							label={name}
							value={String(id)}
							onchange={({ isChecked }) =>
								handleFilterChange({
									categories: isChecked
										? [...filters.categories, name]
										: [...filters.categories.filter((c) => c !== name)]
								})}
						/>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex w-50 flex-col gap-4">
			<h2 class="text-sm font-medium text-neutral-900">Color</h2>
			<div class="flex w-full flex-wrap gap-2.5">
				{#each data.filters.colors as { name, hexadecimal, id } (id)}
					<RadioColor
						type="checkbox"
						checked={filters.colors.includes(name)}
						group="colors"
						hex={hexadecimal}
						{name}
						onchange={({ isChecked }) =>
							handleFilterChange({
								colors: isChecked
									? [...filters.colors, name]
									: [...filters.colors.filter((c) => c !== name)]
							})}
					/>
				{/each}
			</div>
		</div>
		<div class="flex w-50 flex-col gap-4">
			<h2 class="text-sm font-medium text-neutral-900">Size</h2>
			<div class="flex w-full flex-wrap gap-2.5">
				{#each data.filters.sizes as { name, id } (id)}
					<RadioSize
						type="checkbox"
						checked={filters.sizes.includes(name)}
						group="sizes"
						{name}
						onchange={({ isChecked }) =>
							handleFilterChange({
								sizes: isChecked
									? [...filters.sizes, name]
									: [...filters.sizes.filter((c) => c !== name)]
							})}
					/>
				{/each}
			</div>
		</div>
		<div class="flex w-50 flex-col gap-4">
			<h2 class="text-sm font-medium text-neutral-900">Price</h2>
			<Slider
				value={Number(filters.price)}
				max={Number(data.filters.price!.max)}
				onchange={(price) => updatePriceFilter({ price })}
			/>
		</div>
	</div>
	<div class="flex w-216 flex-col gap-5">
		<div class="flex w-full flex-col gap-3 px-4">
			<div class="flex items-center gap-2">
				<h2 class="text-sm font-medium text-neutral-900">Applied Filters:</h2>
				{#if counterFilters > 0}
					<button
						class="cursor-pointer text-xs text-neutral-500 underline"
						onclick={handleClearFilter}>Clear filters</button
					>
				{/if}
			</div>

			<div class="flex w-full flex-wrap items-center justify-start gap-3">
				{#each Object.keys(filtered) as Array<keyof typeof filters> as key (key)}
					{#if key === 'colors'}
						{#each filters.colors as name (name)}
							<Tag
								onclose={() =>
									handleFilterChange({
										colors: [...filters.colors.filter((c) => c !== name)]
									})}
								><RadioColorView
									hex={data.filters.colors.find((c) => c.name === name)!
										.hexadecimal}
								/></Tag
							>
						{/each}
					{/if}
					{#if key === 'categories'}
						{#each filters.categories as name (name)}
							<Tag
								onclose={() =>
									handleFilterChange({
										categories: [
											...filters.categories.filter((c) => c !== name)
										]
									})}>{name}</Tag
							>
						{/each}
					{/if}
					{#if key === 'sizes'}
						{#each filters.sizes as name (name)}
							<Tag
								onclose={() =>
									handleFilterChange({
										sizes: [...filters.sizes.filter((c) => c !== name)]
									})}>{name}</Tag
							>
						{/each}
					{/if}
					{#if key === 'price' && filters.price > 0}
						<Tag
							onclose={() =>
								handleFilterChange({
									price: 0
								})}>$ {Number(filtered[key]).toFixed(2)}</Tag
						>
					{/if}
				{/each}
			</div>
		</div>
		{#if count > 0}
			<div class="mt-6 mr-2.5 flex w-full items-center justify-between px-4">
				<p class="text-xs font-medium text-neutral-500">
					Showing {(filters.page - 1) * filters.perPage + 1}-{Math.min(
						filters.page * filters.perPage,
						count
					)} Of {count} Results.
				</p>
				<Dropdown
					onselect={(orderBy) =>
						handleFilterChange({
							orderBy
						})}
					placeholder="SORT BY"
					selected={filters.orderBy}
					options={[
						{ name: 'None', value: '' },
						{
							name: 'Price',
							value: 'price'
						},
						{ name: 'Rating', value: 'average_rating' }
					]}
				/>
			</div>
		{/if}
		<div class="grid grid-cols-3 gap-6">
			{#each items as { id, inStock, price, name, images, category } (id)}
				<ProductCard
					{id}
					{price}
					{name}
					inStock={Boolean(inStock)}
					category={category[0].name}
					image={images?.[0]}
				/>
			{:else}
				<p class="mt-4 col-span-3 py-10 text-center text-neutral-500">
					No products found. Please try your search again!
				</p>
			{/each}
		</div>
		{#if count > 0}
			<div
				class="mx-auto mt-auto flex h-11 min-w-100 items-center justify-between gap-4 self-end border border-neutral-200 px-5"
			>
				<button
					disabled={filters.page === 1}
					class="flex cursor-pointer items-center justify-center gap-3 text-xs text-neutral-900 disabled:text-neutral-300"
					onclick={() => {
						if (filters.page > 1) {
							handleFilterChange({ page: filters.page - 1 });
						}
					}}
				>
					<img
						src="/icons/arrow-left.svg"
						alt="Arrow Left"
						width="6px"
						height="12px"
					/>

					Preview
				</button>

				<div class="flex items-center gap-1">
					{#each visibleRange as pageNumber (pageNumber)}
						<button
							onclick={() => handleFilterChange({ page: pageNumber })}
							class="{filters.page === pageNumber &&
								'bg-neutral-200'} flex h-8 w-10 cursor-pointer items-center justify-center text-xs font-medium text-neutral-900"
						>
							{pageNumber}
						</button>
					{/each}
				</div>

				<button
					disabled={filters.page === totalPages}
					class="flex cursor-pointer items-center justify-center gap-3 text-xs text-neutral-900 disabled:text-neutral-300"
					onclick={() => {
						if (filters.page < totalPages) {
							handleFilterChange({ page: filters.page + 1 });
						}
					}}
				>
					Next
					<img
						src="/icons/arrow-right.svg"
						alt="Arrow Left"
						width="6px"
						height="12px"
					/>
				</button>
			</div>
		{/if}
	</div>
</div>

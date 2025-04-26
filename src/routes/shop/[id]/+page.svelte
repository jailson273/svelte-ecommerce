<script lang="ts">
	import { goto } from '$app/navigation';
	import Carrossel from '$lib/components/Carrossel/Carrossel.svelte';
	import Counter from '$lib/components/Counter/Counter.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import RadioColor from '$lib/components/RadioColor/RadioColor.svelte';
	import RadioSize from '$lib/components/RadioSize/RadioSize.svelte';
	import { getInitials } from '$lib/utils/getInitials.js';
	import Modal from '$lib/components/Modal/Modal.svelte';
	import { isSignedIn, userId } from '$lib/clerk/client';
	import { addItemToOrder } from '$lib/store/cart/cart.store.js';

	let { data } = $props();

	let writeReview = $state(false);
	let rating = $state(5);
	let colorSelected = $state({
		id: data.product.colors[0].id,
		name: data.product.colors[0].name,
		hexadecimal: data.product.colors[0].hexadecimal
	});
	let sizeSelected = $state({
		id: data.product.sizes[0].id,
		name: data.product.sizes[0].name
	});
	let quantity = $state(1);
	let tab = $state<'details' | 'reviews'>('details');
	let isFavorite = $state(false);
	let errors = $state({ color: '', size: '' });

	let viewCommentLength = $state(3);

	function getTimeAgo(isoDate: string) {
		const now = new Date();
		const date = new Date(isoDate);
		const diff = now.getTime() - date.getTime();
		const seconds = Math.floor(diff / 1000);

		const intervals = {
			year: 31536000,
			month: 2592000,
			week: 604800,
			day: 86400,
			hour: 3600,
			minute: 60,
			second: 1
		};

		for (const [unit, secondsInUnit] of Object.entries(intervals)) {
			const interval = Math.floor(seconds / secondsInUnit);
			if (interval >= 1) {
				return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
			}
		}

		return 'Just Now';
	}

	function formIsValid() {
		errors = { color: '', size: '' };
		if (!colorSelected.id) errors.color = 'Please select a color';
		if (!sizeSelected.id) errors.size = 'Please select a size';
		return !Object.keys(errors).some(
			(key) => errors[key as keyof typeof errors] !== ''
		);
	}

	async function handleAddItemToCart() {
		if (!formIsValid()) return;
		addItemToOrder({
			productId: data.product.id,
			productName: data.product.name,
			price: String(data.product.price),
			quantity,
			colorId: colorSelected.id,
			colorName: colorSelected.name,
			colorHexadecimal: colorSelected.hexadecimal,
			sizeId: sizeSelected.id,
			sizeName: sizeSelected.name,
			imageUrl: data.product.images[0]
		});
		goto('/cart');
	}

	let isOpen = $state(false);

	function handleFavorite(favorite: boolean) {
		if (!$isSignedIn) {
			isOpen = true;
			return;
		}

		if (favorite) setIsFavorite(true);
		if (!favorite) setIsFavorite(false);

		if (!favorite) {
			fetch(`/api/wishlist/${data.product.id}`, {
				method: 'DELETE'
			})
				.then((response) => {
					if (!response.ok) throw new Error('Network response was not ok');
				})
				.catch(() => setIsFavorite(true));
			return;
		}

		if (favorite) {
			const body = new FormData();
			body.set('productId', String(data.product.id));
			body.set('userId', String($userId));

			fetch(`/api/wishlist`, {
				method: 'POST',
				body
			})
				.then((response) => {
					if (!response.ok) throw new Error('Network response was not ok');
				})
				.catch(() => setIsFavorite(false));
		}
	}

	function setIsFavorite(favorite: boolean) {
		isFavorite = favorite;
	}

	$effect(() => {
		fetch(`/api/wishlist/?productId=${data.product.id}&userId=${$userId}`)
			.then((resp) => resp.json())
			.then((data) => setIsFavorite(data.favorite));
	});
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
		<a class="text-sm font-medium text-neutral-900 hover:underline" href="/shop"
			>Shop</a
		>
		<span class="px-2.25 py-1.5">
			<img
				src="/icons/arrow-right.svg"
				alt="Arrow Right"
				height="12px"
				width="6px"
			/>
		</span>
		<span class="text-sm font-medium text-neutral-900">{data.product.name}</span
		>
	</nav>
</div>

<div class="mx-auto mt-4 flex w-279 items-center gap-30 pt-12">
	<Carrossel product={data.product} />
	<div class="flex flex-1 flex-col">
		<div class="flex w-full items-center justify-between">
			<h1 class="text-2xl font-bold text-neutral-900">{data.product.name}</h1>
			<button class="cursor-pointer">
				<img src="/icons/share.svg" alt="Share" width="16px" height="18px" />
			</button>
		</div>
		<div class="mt-3 flex items-center gap-2">
			<div
				class="flex h-7 w-fit items-center gap-3 bg-neutral-100 px-4 text-xs font-medium text-neutral-500"
			>
				<img
					src="/icons/start-filled.svg"
					alt="Star Filled"
					width="16px"
					height="15px"
				/>
				{data.product.averageRating} - {data.product.reviews} Reviews
			</div>
			<div
				class="flex h-7 w-22.25 items-center justify-center border border-neutral-200 text-xs font-medium text-neutral-500 uppercase"
			>
				{data.product.inStock ? 'In Stock' : 'No Stock'}
			</div>
		</div>
		<p class="mt-6 text-lg font-semibold text-neutral-900">
			$ {data.product.price.toFixed(2)}
		</p>
		<div class="mt-8 flex flex-col gap-2.5">
			<p class="text-xs font-medium text-neutral-500 uppercase">
				Available Colors
			</p>
			<div class=" flex items-center gap-2.5">
				{#each data.product.colors as { id, name, hexadecimal }, i (id)}
					<RadioColor
						checked={i === 0 ? true : false}
						group="colors"
						hex={hexadecimal}
						{name}
						onchange={() => (colorSelected = { id, hexadecimal, name })}
					/>
				{/each}
			</div>
			{#if errors.color}
				<p class="-mt-2 flex text-xs text-red-600">{errors.color}</p>
			{/if}
		</div>
		<div class="mt-8 flex flex-col gap-2.5">
			<p class="text-xs font-medium text-neutral-500 uppercase">Select Size</p>
			<div class=" flex items-center gap-2.5">
				{#each data.product.sizes as { name, id }, i (id)}
					<RadioSize
						{name}
						checked={i === 0 ? true : false}
						group="sizes"
						onchange={() => (sizeSelected = { id, name })}
					/>
				{/each}
			</div>
			{#if errors.size}
				<p class="-mt-2 flex text-xs text-red-600">{errors.size}</p>
			{/if}
		</div>
		<div class="mt-8 flex flex-col gap-2.5">
			<p class="text-xs font-medium text-neutral-500 uppercase">Quantity</p>
			<div class=" flex items-center gap-2.5">
				<Counter onchange={(value) => (quantity = value)} />
			</div>
		</div>
		<div class="mt-8 flex items-center gap-4">
			<button
				onclick={handleAddItemToCart}
				class="flex h-11 w-71 cursor-pointer items-center justify-center bg-neutral-900 text-white"
			>
				Add to cart
			</button>
			<button
				onclick={() => handleFavorite(!isFavorite)}
				class="flex h-11 w-11 cursor-pointer items-center justify-center border border-neutral-100"
			>
				{#if !isFavorite}
					<img src="/icons/heart.svg" alt="Heart" width="17px" height="14px" />
				{/if}
				{#if isFavorite}
					<img
						src="/icons/heart-filled.svg"
						alt="Heart"
						width="17px"
						height="14px"
					/>
				{/if}
			</button>
		</div>
		<p class="mt-3 text-xs font-medium text-neutral-500 uppercase">
			— Free shipping on orders $100+
		</p>
	</div>
</div>

<div class="mx-auto mt-20 flex w-278 gap-8">
	<div class="flex w-60.25 flex-col gap-4">
		<button
			onclick={() => (tab = 'details')}
			class=" flex h-10.25 cursor-pointer items-center gap-2.5 px-6 text-sm font-medium text-neutral-900 {tab ===
				'details' && 'bg-neutral-100'}"
		>
			<img src="/icons/points.svg" alt="Points" />
			Details</button
		>
		<button
			onclick={() => (tab = 'reviews')}
			class="flex h-10.25 cursor-pointer items-center gap-2.5 px-6 text-sm font-medium text-neutral-900 {tab ===
				'reviews' && 'bg-neutral-100'}"
		>
			<img
				src="/icons/start-light.svg"
				alt="Start Light"
				width="14px"
				height="13px"
			/> Reviews
		</button>
	</div>
	{#if tab === 'details'}
		<div class="flex flex-col gap-6">
			<h2 class="text-[16px] font-semibold text-neutral-900">Detail</h2>
			<div class="w-181.75 text-sm text-neutral-500">
				{data.product.description}
			</div>
		</div>
	{/if}
	{#if tab === 'reviews'}
		<div class="flex flex-1 flex-col">
			<div class="flex flex-col border-b border-neutral-200 pb-4">
				<h2 class="text-[16px] font-semibold text-neutral-900">Reviews</h2>
				<p class="mt-4 flex items-center gap-4">
					<span class="text-[32px] font-bold text-neutral-900"
						>{data.product.averageRating}</span
					>
					<span class="text-sm text-neutral-400"
						>— {data.product.reviews} Reviews</span
					>
				</p>
				{#if !writeReview}
					<button
						class="mt-10 flex h-11 w-36 cursor-pointer items-center justify-center border border-neutral-900 text-sm font-medium text-neutral-900"
						onclick={() => (writeReview = true)}>Write a review</button
					>
				{/if}
				<button
					class="flex h-6 items-center gap-1.5 self-end text-xs font-medium text-neutral-500 uppercase"
					>Sort By

					<img
						src="/icons/chevron-down.svg"
						width="12px"
						height="6px"
						alt="Chevron Down"
					/>
				</button>
			</div>

			<div class="mt-6 flex w-full flex-col">
				{#if writeReview}
					<div class="flex w-full flex-col gap-6 border border-neutral-200 p-6">
						<h2 class="text-[16px] font-semibold text-neutral-900">
							Write a review
						</h2>
						<p class="text-sm text-neutral-500">
							Your email address will not be published. Required fields are
							marked *
						</p>
						<div class="flex items-center gap-4">
							<span
								class="flex size-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white"
								>{rating}</span
							>
							<div class="flex items-center gap-1.5">
								{#each Array(5) as _, i (i)}
									<button
										onclick={() => (rating = i + 1)}
										class="cursor-pointer"
									>
										<img
											src="/icons/start-{i + 1 <= rating
												? 'filled'
												: 'light'}.svg"
											alt="Star {i + 1 <= rating ? 'filled' : 'light'}"
											width="16px"
											height="15px"
										/>
									</button>
								{/each}
							</div>
						</div>
						<textarea
							class="h-32 w-full resize-none border border-neutral-200 p-4 text-sm text-neutral-500"
							placeholder="Write your review here..."
						></textarea>
						<div class="flex items-center gap-4 self-end">
							<button
								class="flex h-11 w-36 cursor-pointer items-center justify-center border border-neutral-900 text-sm font-medium text-neutral-900"
								onclick={() => {
									writeReview = false;
									rating = 5;
								}}>Cancel</button
							>
							<button
								class="flex h-11 w-fit cursor-pointer items-center justify-center bg-neutral-900 px-10 text-white"
								onclick={() => (writeReview = false)}>Submit</button
							>
						</div>
					</div>
				{/if}
				{#each data.reviews.slice(0, viewCommentLength) as { description, rating, name, date }, i (name + '-' + i)}
					<div class="flex w-full justify-between py-9.5">
						<div class="flex gap-6">
							<div
								class="flex size-12 items-center justify-center rounded-full bg-blue-100 text-sm text-blue-900 uppercase"
							>
								{getInitials(name)}
							</div>
							<div class="flex flex-col">
								<p class="text-sm font-medium text-neutral-900">{name}</p>
								<p
									class="mt-1.5 text-xs font-medium text-neutral-500 uppercase"
								>
									{getTimeAgo(date)}
								</p>
								<p class="mt-4 text-sm text-neutral-500">
									{description}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-1">
							{#each Array(5) as _, i (i)}
								<img
									src="/icons/start-{i + 1 <= rating ? 'filled' : 'light'}.svg"
									alt="Star {i + 1 <= rating ? 'filled' : 'light'}"
									width="16px"
									height="15px"
								/>
							{/each}
						</div>
					</div>
				{:else}
					<p class=" text-sm font-medium text-neutral-500">No reviews yet</p>
				{/each}
				{#if data.reviews.length > viewCommentLength}
					<button
						onclick={() => (viewCommentLength += 3)}
						class="mt-20 flex h-11 w-43.75 cursor-pointer items-center justify-center self-center border border-neutral-200 text-sm font-medium text-neutral-500"
						>Load more reviews</button
					>
				{/if}
			</div>
		</div>
	{/if}
</div>
<div class="mx-auto mt-20 mb-20 flex w-275 flex-col gap-14">
	<div class="flex flex-col gap-2">
		<h2 class="text-2xl font-bold text-neutral-900">You might also like</h2>
		<p class="text-xs font-medium text-neutral-300 uppercase">
			SIMILAR PRODUCTS
		</p>
	</div>
	<div class="flex w-full gap-7">
		{#each data.relateds as { id, inStock, name, price, images, category } (id)}
			<ProductCard
				category={category[0].name}
				{id}
				{name}
				{price}
				inStock={Boolean(inStock)}
				image={images[0]}
			/>
		{/each}
	</div>
</div>

<Modal {isOpen} onClose={() => (isOpen = false)}>
	<div class="flex h-50 w-100 flex-col items-center justify-center gap-1">
		<p>Log in to favorite this product</p>
		<a href="/auth/login?redirect=/shop/{data.product.id}" class="underline"
			>Sign In</a
		>
	</div>
</Modal>

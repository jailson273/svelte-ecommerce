<script lang="ts">
	import { userId } from '$lib/clerk/client';
	import { urlFilteredSubscribe } from '$lib/store/shop/subscribes/shop.subscribe';
	import { convertDate } from '$lib/utils/convertDate';

	interface WishlistItem {
		id: number;
		productId: number;
		name: string;
		imageUrl: string;
		date: string;
		price: number;
	}

	let urlFiltered = $state('');
	urlFilteredSubscribe((value) => (urlFiltered = value));

	let _userId = $state<number | null>(null);
	userId.subscribe((value) => (_userId = value));
	let wishlist = $state<WishlistItem[]>([]);

	function onremove(id) {
		fetch(`/api/wishlist/${id}`, {
			method: 'DELETE'
		})
			.then((resp) => resp.json())
			.then(() => {
				wishlist = wishlist.filter((item) => item.id !== id);
			})
			.catch((error) => {
				console.error('Error removing item from wishlist:', error);
			});
	}

	$effect(() => {
		fetch(`/api/user/${_userId}/wishlist`)
			.then((resp) => resp.json())
			.then((data) => (wishlist = data))
			.catch((error) => {
				console.error('Error fetching wishlist:', error);
			});
	});
</script>

<h2 class="text-[16px] font-semibold text-neutral-900">Wishlist</h2>
<div class="mt-6 flex flex-col">
	{#each wishlist as { id, productId, date, imageUrl, name, price } (id)}
		<div
			class="flex w-154.25 items-center justify-between border-b border-b-neutral-200 py-8 last:border-b-0"
		>
			<div class="flex items-center gap-8">
				<div class="flex size-20 items-center justify-center bg-neutral-100">
					<img src={imageUrl} alt="Produto" width="44px" height="62px" />
				</div>
				<div class="flex flex-col gap-1">
					<div class="flex gap-2">
						<img
							src="/icons/heart-filled.svg"
							alt="heart"
							width="18px"
							height="18px"
						/>

						<h2 class="text-sm font-medium text-neutral-900">
							{name}
						</h2>
					</div>
					<p class="text-xs font-medium text-neutral-500">
						{convertDate(date)}
					</p>
					<button
						onclick={() => onremove(id)}
						class="w-fit cursor-pointer text-start text-xs font-medium text-neutral-900 hover:underline"
						>Remove item</button
					>
				</div>
			</div>
			<div class="flex items-center gap-8">
				<p class="text-sm font-medium text-neutral-900">$ {price.toFixed(2)}</p>
				<a
					href="/shop/{productId}"
					class="flex h-11 w-28.5 cursor-pointer items-center justify-center border border-neutral-900 text-sm font-medium text-neutral-900 hover:underline"
					>Add to cart</a
				>
			</div>
		</div>
	{:else}
		<p class="mt-4 w-94.75 self-center text-center text-neutral-500">
			You have not favorite products. <a
				href={urlFiltered}
				class="text-neutral-900 underline">Start shopping now!</a
			>
		</p>
	{/each}
</div>

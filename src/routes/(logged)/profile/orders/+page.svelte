<script lang="ts">
	import { userId } from '$lib/clerk/client';
	import Loader from '$lib/components/Loader/Loader.svelte';
	import { convertDate } from '$lib/utils/convertDate';
	import type { Order } from '$lib/models/Order';
	import { urlFilteredSubscribe } from '$lib/store/shop/subscribes/shop.subscribe';

	let loading = $state(false);
	let urlFiltered = $state('');
	urlFilteredSubscribe((value) => (urlFiltered = value));

	let _userId = $state<number | null>(null);
	userId.subscribe((value) => (_userId = value));

	let orders = $state<Omit<Order, 'items'>[]>([]);

	$effect(() => {
		loading = true;
		if (_userId) {
			fetch(`/api/user/${_userId}/order/placedOrders`)
				.then((res) => res.json())
				.then((data) => (orders = data))
				.finally(() => (loading = false));
		}
	});
</script>

<h2 class="text-[16px] font-semibold text-neutral-900">Orders</h2>
<div class="mt-6 flex flex-col">
	{#each orders as { id, placedOrderDate, total, status } (id)}
		<div
			class="flex w-154.25 items-center justify-between border-b border-b-neutral-200 py-8 last:border-b-0"
		>
			<div class="flex items-center gap-8">
				<div class="flex size-20 items-center justify-center bg-neutral-100">
					<img
						src="/products/product-1.jpg"
						alt="Produto"
						width="44px"
						height="62px"
					/>
				</div>
				<div class="flex flex-col gap-1">
					<h2 class="text-sm font-medium text-neutral-900">
						{`#${id}`}
					</h2>
					<p class="text-xs font-medium text-neutral-500">
						{convertDate(String(placedOrderDate))}
					</p>
					<span class="text-xs font-medium text-neutral-900"
						>$ {total.toFixed(2)}</span
					>
				</div>
			</div>
			<div class="flex items-center gap-8">
				<p class="text-sm font-medium text-neutral-900 underline">{status}</p>
				<a
					href="/checkout/{id}"
					class="flex h-11 w-28.5 items-center justify-center border border-neutral-900 text-sm font-medium text-neutral-900 hover:underline"
					>View Order</a
				>
			</div>
		</div>
	{:else}
		<p class="mt-4 w-94.75 self-center text-center text-neutral-500">
			You have not orders. <a
				href={urlFiltered}
				class="text-neutral-900 underline">Start shopping now!</a
			>
		</p>
	{/each}
</div>

<Loader {loading} />

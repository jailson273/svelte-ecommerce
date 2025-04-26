<script lang="ts">
	import RadioColorView from '$lib/components/RadioColor/RadioColorView.svelte';

	const { data } = $props();
	console.log('data.order', data.order);
</script>

<div class="flex h-16 w-full items-center justify-center bg-green-100">
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
		<span class="text-sm font-medium text-neutral-900">Checkout</span>
		<span class="px-2.25 py-1.5">
			<img
				src="/icons/arrow-right.svg"
				alt="Arrow Right"
				height="12px"
				width="6px"
			/>
		</span>
		<span class="text-sm font-medium text-neutral-900">After</span>
	</nav>
</div>

<div
	class="mx-auto flex w-275 flex-col items-center justify-center pt-10 pb-30"
>
	<div class="mx-auto flex w-275 flex-col items-center justify-center">
		<img
			src="/img/affter-success.png"
			alt="After Success"
			width="160.93"
			height="159.73"
		/>
		<h2 class="text-2xl font-bold text-neutral-900">Thank you for shopping</h2>
		<p class="mt-4 w-94.75 text-center text-sm text-neutral-500">
			Your order has been successfully placed and is now being processed.
		</p>
		<a href="/profile/orders" class="mt-4 text-sm underline">Go to my orders</a>
	</div>

	<div class="flex w-157 flex-col gap-4">
		<h2
			class="mt-4 border-b border-neutral-200 py-2 text-[16px] font-semibold text-neutral-900"
		>
			Order Details
		</h2>
		<div class="flex w-full flex-col gap-2">
			<div class="flex w-full items-center justify-between">
				<span>Subtotal</span>
				<span>$ {Number(data.order.subtotal).toFixed(2)}</span>
			</div>

			<div class="flex w-full items-center justify-between">
				<span>Tax</span>
				<span>$ {Number(data.order.tax).toFixed(2)}</span>
			</div>

			{#if data.order.couponCode}
				<div class="flex w-full items-center justify-between">
					<span>Coupon</span>
					<span>{data.order.couponCode}</span>
				</div>
				<div class="flex w-full items-center justify-between">
					<span>Discount</span>
					<span class="text-red-600"
						>- $ {Number(data.order.discount).toFixed(2)}</span
					>
				</div>
			{/if}
			<div class="flex w-full items-center justify-between">
				<span class="font-bold">Total</span>
				<span class="font-bold">$ {Number(data.order.total).toFixed(2)}</span>
			</div>
		</div>

		<h2
			class="border-b border-neutral-200 py-2 text-[16px] font-semibold text-neutral-900"
		>
			Your Items
		</h2>

		<div class="flex flex-col gap-4">
			{#each data.order?.items as { id, colorHexadecimal, sizeName, price, quantity, imageUrl, productName } (id)}
				<div class="flex w-full items-center justify-between">
					<div class="flex w-full items-center gap-4">
						<div class="flex items-center gap-8">
							<div
								class="flex size-20 items-center justify-center bg-neutral-100"
							>
								<img src={imageUrl} alt="Product" class="h-15.5 w-11" />
							</div>
							<div class="gap-gap-1.5 flex flex-col items-center">
								<div class="flex text-sm font-medium text-neutral-900">
									{productName}
								</div>
								<div
									class="flex w-full items-center text-xs font-medium text-neutral-500"
								>
									Color: <RadioColorView hex={colorHexadecimal} /> — Size: {sizeName}
								</div>
							</div>
						</div>
					</div>
					<div class="flex w-full items-center justify-end gap-16">
						<p class="mr-4 text-sm font-medium text-neutral-900">
							$ {(!isNaN(Number(price)) ? Number(price) : 0).toFixed(2)}
						</p>
						<span>{quantity}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<a
		href="/profile/orders"
		class="mx-auto mt-12 flex h-11 w-49 items-center justify-center gap-2.5 bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-900"
		>Go to my orders
		<img src="/icons/seta-right.svg" alt="Seta Right" width="13" height="12" />
	</a>
</div>

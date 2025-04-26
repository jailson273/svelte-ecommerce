<script lang="ts">
	import { goto } from '$app/navigation';
	import Counter from '$lib/components/Counter/Counter.svelte';
	import RadioColorView from '$lib/components/RadioColor/RadioColorView.svelte';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	import {
		countSubscribe,
		loadingSubscribe,
		orderSubscribe
	} from '$lib/store/cart/subscribes/cart.subscribe';
	import { addressOrderUpdate } from '$lib/store/cart/cart.store';
	import { taxCartUpdate } from '$lib/store/cart/updates/tax.update';
	import { urlFilteredSubscribe } from '$lib/store/shop/subscribes/shop.subscribe';
	import { clerk } from '$lib/clerk/client';
	import { get } from 'svelte/store';
	import type { Order } from '$lib/models/Order';
	import { decrement, increment, removeItem } from '$lib/store/cart/cart.store';
	import Loader from '$lib/components/Loader/Loader.svelte';

	const _clerk = get(clerk);

	let isLoadingZipCode = $state(false);
	let errZipCode = $state('');
	let count = $state(0);
	let zipCode = $state('');
	let order: Order = $state({} as Order);
	orderSubscribe((prev) => {
		order = prev;
		console.log('order.zipCode', order);
		zipCode = prev?.zipCode || '';
	});

	let urlFiltered = $state('');
	urlFilteredSubscribe((prev) => (urlFiltered = prev));

	countSubscribe((prev) => (count = prev));

	let loading = $state(false);
	loadingSubscribe((prev) => (loading = prev));

	function maskZipCode(value: string) {
		const onlyNumbers = value.replace(/\D/gi, '');
		return onlyNumbers.replace(/(\d{5})(\d{1,3})/, '$1-$2');
	}

	async function searchZipCode(zipCode: string) {
		isLoadingZipCode = true;
		fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
			.then((resp) => resp.json())
			.then((data) => {
				if (data.erro) {
					errZipCode = 'Oops, zip code not found';
					return;
				}

				addressOrderUpdate({
					tax: data.siafi / 100,
					zipCode: data.cep,
					city: data.localidade,
					state: data.uf,
					street: data.logradouro,
					district: data.bairro
				});

				taxCartUpdate(data.siafi / 100);
			})
			.catch(() => (errZipCode = 'Oops, try again'))
			.finally(() => (isLoadingZipCode = false));
	}

	function oninput(e: any) {
		errZipCode = '';
		zipCode = e.target.value;
		if (!zipCode) {
			return;
		}
		const onlyNumbers = zipCode.replace(/-/g, '');
		if (onlyNumbers.length === 8) {
			searchZipCode(onlyNumbers);
		}
	}
</script>

<div class="flex h-16 w-full items-center justify-center bg-neutral-100">
	<div class="flex w-279 flex-col gap-2">
		<nav class="flex items-center gap-2">
			<a href="/#" class="text-sm text-neutral-500 hover:underline">eCommerce</a
			>
			<span class="px-2.25 py-1.5">
				<img
					src="/icons/arrow-right.svg"
					alt="Arrow Right"
					height="12px"
					width="6px"
				/>
			</span>
			<span class="text-sm font-medium text-neutral-900">Cart</span>
		</nav>
	</div>
</div>

<div class="mx-auto my-14 flex w-279 gap-30.5">
	<div class="flex w-157 flex-col gap-12">
		<h2
			class="border-b border-neutral-200 py-4.5 text-[16px] font-semibold text-neutral-900"
		>
			Your cart
		</h2>
		<div class=" flex flex-col gap-10">
			{#each order?.items as { id, productId, colorHexadecimal, sizeName, price, quantity, imageUrl }, i (i)}
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-8">
						<a
							href="/shop/{productId}"
							class="flex size-20 items-center justify-center bg-neutral-100"
						>
							<img src={imageUrl} alt="Product" class="h-15.5 w-11" />
						</a>
						<div class="gap-gap-1.5 flex flex-col items-center">
							<div class="flex text-sm font-medium text-neutral-900">
								{name}
							</div>
							<div
								class="flex w-full items-center text-xs font-medium text-neutral-500"
							>
								Color: <RadioColorView hex={colorHexadecimal} /> — Size: {sizeName}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<p class="mr-4 text-sm font-medium text-neutral-900">
							$ {(!isNaN(Number(price)) ? Number(price) : 0).toFixed(2)}
						</p>
						<Counter
							init={quantity}
							onchange={(value) => {
								if (value > quantity) increment(id);
								if (value < quantity) decrement(id);
							}}
						/>
						<button
							onclick={() => removeItem(id)}
							class="flex size-11 cursor-pointer items-center justify-center bg-neutral-100"
						>
							<img
								src="/icons/close.svg"
								alt="close"
								width="20px"
								height="20px"
							/>
						</button>
					</div>
				</div>
			{:else}
				<p class="mt-4 w-94.75 self-center text-center text-neutral-500">
					Your cart is empty. <a
						href={urlFiltered}
						class="text-neutral-900 underline">Start shopping now!</a
					>
				</p>
			{/each}
		</div>
	</div>
	<div
		class="flex h-fit w-85.25 flex-col border border-neutral-100 px-6 pt-8 pb-10"
	>
		<h2 class="mb-10 text-[16px] font-semibold text-neutral-900">
			Order Summary
		</h2>
		<div class=" flex flex-col gap-3">
			<div class="flex w-full items-center justify-between">
				<span class="text-sm font-medium text-neutral-500">Subtotal</span>
				<span class="text-sm font-medium text-neutral-900"
					>$ {(!isNaN(Number(order.subtotal))
						? Number(order.subtotal)
						: 0
					).toFixed(2)}</span
				>
			</div>
			<div class="flex w-full items-center justify-between">
				<span class="text-sm font-medium text-neutral-500">Zip Code</span>
				<div class="flex items-center">
					{#if isLoadingZipCode}
						<Spinner class="size-3 text-neutral-900" />
					{/if}

					<input
						disabled={isLoadingZipCode}
						placeholder="00000-000"
						value={maskZipCode(zipCode)}
						{oninput}
						type="text"
						class="w-20 border-b border-neutral-100 py-0.5 text-end text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-300 {isLoadingZipCode &&
							'cursor-not-allowed'}"
					/>
				</div>
			</div>
			{#if !isLoadingZipCode && errZipCode}
				<p class="-mt-3 flex self-end text-xs text-red-600">{errZipCode}</p>
			{/if}
			<div class="flex w-full items-center justify-between">
				<span class="text-sm font-medium text-neutral-500">Tax</span>
				<span class="text-sm font-medium text-neutral-900"
					>$ {(!isNaN(Number(order.tax)) ? Number(order.tax) : 0).toFixed(
						2
					)}</span
				>
			</div>
		</div>
		<div class="my-6 h-[1px] w-full bg-neutral-100"></div>
		<div class="flex w-full items-center justify-between">
			<span class="text-sm font-medium text-neutral-900">Total</span>
			<span class="text-sm font-medium text-neutral-900"
				>$ {(!isNaN(Number(order.total)) ? Number(order.total) : 0).toFixed(
					2
				)}</span
			>
		</div>
		{#if count > 0}
			{#if _clerk?.isSignedIn}
				<button
					onclick={() => {
						if (!zipCode.trim()) {
							errZipCode = 'Please enter a zip code';
							return;
						}
						goto('/checkout');
					}}
					class="mt-8 flex h-11 cursor-pointer items-center justify-center bg-neutral-900 text-sm font-medium text-white"
					>Checkout</button
				>
			{:else}
				<a
					href="/auth/login?redirect=/checkout"
					class="mt-8 flex h-11 cursor-pointer items-center justify-center bg-neutral-900 text-sm font-medium text-white"
					>Login to checkout</a
				>
			{/if}
		{/if}
		<a
			href={urlFiltered}
			class="mt-10 flex self-center text-xs font-medium text-neutral-900 underline"
			>Continue Shopping</a
		>
	</div>
</div>
<Loader {loading} />

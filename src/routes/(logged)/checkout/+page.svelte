<script lang="ts">
	import { goto } from '$app/navigation';
	import { userId } from '$lib/clerk/client';
	import Loader from '$lib/components/Loader/Loader.svelte';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	import type { Address } from '$lib/models/Address';
	import type { Coupon } from '$lib/models/Coupon';
	import type { Order } from '$lib/models/Order';
	import {
		addressOrderUpdate,
		removeCouponUpdate,
		setCouponUpdate
	} from '$lib/store/cart/cart.store';
	import {
		loadingSubscribe,
		orderSubscribe
	} from '$lib/store/cart/subscribes/cart.subscribe';

	import { taxCartUpdate } from '$lib/store/cart/updates/tax.update';
	import { urlFilteredSubscribe } from '$lib/store/shop/subscribes/shop.subscribe';
	import { get } from 'svelte/store';

	let loading = $state(false);
	loadingSubscribe((prev) => (loading = prev));

	let isLoadingZipCode = $state(false);
	let errors: Partial<Record<keyof Address, string>> = $state({});

	let urlFiltered = $state('');
	urlFilteredSubscribe((prev) => (urlFiltered = prev));

	let order: Order = $state({} as Order);
	orderSubscribe((prev) => (order = prev));

	function onUpdateAddress(field: keyof Address, value: string) {
		addressOrderUpdate({ [field]: value });
	}

	function maskZipCode(value: string) {
		const onlyNumbers = value.replace(/\D/gi, '');
		return onlyNumbers.replace(/(\d{5})(\d{1,3})/, '$1-$2');
	}

	function oninput(e: any) {
		errors.zipCode = '';
		order.zipCode = e.target.value;
		if (!order.zipCode) {
			return;
		}
		const onlyNumbers = order.zipCode.replace(/-/g, '');
		if (onlyNumbers.length === 8) {
			searchZipCode(onlyNumbers);
		}
	}

	async function searchZipCode(zipCode: string) {
		isLoadingZipCode = true;
		fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
			.then((resp) => resp.json())
			.then((data) => {
				if (data.erro) {
					errors.zipCode = 'Oops, zip code not found';
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
				errors = { number: errors?.number };
			})
			.catch(() => (errors.zipCode = 'Oops, try again'))
			.finally(() => (isLoadingZipCode = false));
	}

	async function onsubmit(e: Event) {
		e.preventDefault();

		if (!order?.zipCode?.trim()) {
			errors.zipCode = 'This field is required';
		} else {
			errors.zipCode = '';
		}

		if (!order?.street?.trim()) {
			errors.street = 'This field is required';
		} else {
			errors.street = '';
		}

		if (!order?.number?.trim()) {
			errors.number = 'This field is required';
		} else {
			errors.number = '';
		}

		if (!order?.district?.trim()) {
			errors.district = 'This field is required';
		} else {
			errors.district = '';
		}

		if (!order?.city?.trim()) {
			errors.city = 'This field is required';
		} else {
			errors.city = '';
		}

		if (Object.keys(errors).some((key) => Boolean(errors[key]))) return;

		loading = true;
		const _userId = get(userId);
		const formAddress = new FormData();

		formAddress.append('zipCode', String(order?.zipCode));
		formAddress.append('street', String(order?.street));
		formAddress.append('number', String(order?.number));
		formAddress.append('district', String(order?.district));
		formAddress.append('complement', String(order?.complement));
		formAddress.append('city', String(order?.city));
		formAddress.append('state', String(order?.state));
		formAddress.append('country', String(order?.country));
		formAddress.append('tax', String(order?.tax));

		await fetch(`/api/user/${_userId}/order/${order.id}/address`, {
			method: 'PUT',
			body: formAddress
		}).catch(() => (loading = false));

		await fetch(`/api/user/${_userId}/order/${order.id}/placeOrder`, {
			method: 'PUT'
		});

		loading = false;

    

		goto(`/checkout/${order.id}`);
	}

	let code = $state('');
	let showAddCoupon = $state(false);
	let couponLoading = $state(false);
	let couponErr = $state('');
	async function addCoupon(e: Event) {
		e.preventDefault();
		couponErr = '';
		if (!code) {
			couponErr = 'Coupon required';
			return;
		}
		couponLoading = true;
		const response = await fetch(`/api/coupon/${code.toUpperCase()}`);
		if (response.status === 404) {
			couponErr = 'Coupon not found.';
			couponLoading = false;
			return;
		}
		const data: Coupon = await response.json();
		setCouponUpdate(data);
		couponLoading = false;
		code = '';
		showAddCoupon = false;
	}
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
		<a
			class="text-sm font-medium text-neutral-900 hover:underline"
			href={urlFiltered}>Cart</a
		>
		<span class="px-2.25 py-1.5">
			<img
				src="/icons/arrow-right.svg"
				alt="Arrow Right"
				height="12px"
				width="6px"
			/>
		</span>
		<span class="text-sm font-medium text-neutral-900">Checkout</span>
	</nav>
</div>

<form class="mx-auto my-14.5 flex w-275" {onsubmit}>
	<div class="mt-4 flex w-133.5 flex-col">
		<h2 class="text-[16px] font-semibold text-neutral-900">Shipping Address</h2>
		<div class="mt-16 flex flex-col gap-3.75">
			<div class="flex w-1/2 flex-col gap-1">
				<label for="zip-code" class="text-sm font-medium text-neutral-600"
					>Zip Code</label
				>
				<div class="relative flex items-center">
					<input
						disabled={isLoadingZipCode}
						value={maskZipCode(order?.zipCode || '')}
						{oninput}
						type="text"
						id="zip-code"
						placeholder="00000-000"
						class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 disabled:cursor-not-allowed"
					/>
					{#if isLoadingZipCode}
						<Spinner class="absolute -right-14 size-7 text-neutral-900" />
					{/if}
				</div>
				{#if !isLoadingZipCode && errors.zipCode}
					<p class="flex text-xs text-red-600">{errors.zipCode}</p>
				{/if}
			</div>
			<div class="flex gap-4">
				<div class="flex flex-1 flex-col gap-1">
					<label for="street" class="text-sm font-medium text-neutral-600"
						>Street Address</label
					>
					<input
						onchange={(e) => onUpdateAddress('street', e.currentTarget.value)}
						value={order.street}
						type="text"
						id="street"
						placeholder="Enter your street"
						class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
					/>
					{#if errors.street}
						<p class="flex text-xs text-red-600">{errors.street}</p>
					{/if}
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex w-1/2 flex-col gap-1">
					<label for="city" class="text-sm font-medium text-neutral-600"
						>City</label
					>
					<div class="relative flex items-center">
						<input
							onchange={(e) => onUpdateAddress('city', e.currentTarget.value)}
							value={order.city}
							type="text"
							id="city"
							placeholder="Enter your city"
							class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
						/>
						<span
							class=" absolute right-4 text-sm font-semibold text-neutral-300"
							>{order.state}</span
						>
					</div>
					{#if errors.city}
						<p class="flex text-xs text-red-600">{errors.city}</p>
					{/if}
				</div>
				<div class="flex flex-1 flex-col gap-1">
					<label for="district" class="text-sm font-medium text-neutral-600"
						>District</label
					>

					<input
						onchange={(e) => onUpdateAddress('district', e.currentTarget.value)}
						value={order.district}
						type="text"
						id="district"
						placeholder="Your district"
						class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
					/>
					{#if errors.district}
						<p class="flex text-xs text-red-600">{errors.district}</p>
					{/if}
				</div>
			</div>
			<div class="flex gap-4">
				<div class="flex w-1/2 flex-col gap-1">
					<label for="number" class="text-sm font-medium text-neutral-600"
						>Number</label
					>
					<input
						onchange={(e) => onUpdateAddress('number', e.currentTarget.value)}
						value={order.number}
						type="text"
						id="number"
						placeholder="Enter your number"
						class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
					/>
					<p class="flex text-xs text-neutral-500">
						If not exist number enter with S/N or SN
					</p>
					{#if errors.number}
						<p class="flex text-xs text-red-600">{errors.number}</p>
					{/if}
				</div>
				<div class="flex flex-1 flex-col gap-1">
					<label for="complement" class="text-sm font-medium text-neutral-600"
						>Complement</label
					>
					<input
						onchange={(e) =>
							onUpdateAddress('complement', e.currentTarget.value)}
						value={order.complement}
						type="text"
						id="complement"
						placeholder="Your complement"
						class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
					/>
				</div>
			</div>
		</div>
	</div>

	<div class="mr-16 ml-29.75 h-full w-0.5 bg-neutral-100"></div>

	<div class="mt-4 flex w-93 flex-col">
		<h2 class="text-[16px] font-semibold text-neutral-900">Your Order</h2>
		<div class="mt-16 flex flex-col">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					{#each order.items.slice(0, 3) as { id, imageUrl, productName } (id)}
						<span
							class="flex size-10 items-center justify-center overflow-x-hidden rounded-full bg-neutral-100"
						>
							<img
								src={imageUrl}
								alt={productName}
								width="25px"
								height="35px"
							/>
						</span>
					{/each}
					{#if order.items.length > 3}
						<span
							class="flex size-10 items-center justify-center overflow-x-hidden rounded-full bg-neutral-100"
						>
							...
						</span>
					{/if}
				</div>
				<a
					href="/cart"
					class="flex h-11 w-26.75 items-center justify-center rounded-sm border border-neutral-200 text-sm font-medium text-neutral-500"
					>Edit Cart</a
				>
			</div>
			<div class=" mt-16 flex flex-col gap-3">
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
					<span class="text-sm font-medium text-neutral-500">Tax</span>
					<span class="text-sm font-medium text-neutral-900"
						>$ {(!isNaN(Number(order.tax)) ? Number(order.tax) : 0).toFixed(
							2
						)}</span
					>
				</div>
				{#if order.items.length > 0}
					<div class="mt-4 flex w-full items-center justify-between">
						{#if !showAddCoupon && !order.couponCode}
							<button
								onclick={() => (showAddCoupon = true)}
								type="button"
								class="cursor-pointer text-xs font-medium text-neutral-900 underline"
								>Add Coupon</button
							>
						{/if}
						{#if showAddCoupon && !order.couponCode}
							<div class="flex w-50 flex-col gap-1">
								<div class="flex items-center gap-1">
									<input
										disabled={couponLoading}
										placeholder="Coupon code"
										name="code"
										id="code"
										value={code}
										oninput={(e) => {
											code = e.currentTarget.value;
											if (!code) couponErr = '';
										}}
										type="text"
										class="h-8 w-full border border-neutral-300 px-4 text-sm font-medium text-neutral-500 uppercase outline-none"
									/>
									{#if couponLoading}
										<Spinner class="ml-1 size-7" />
									{:else}
										<button
											disabled={couponLoading}
											onclick={addCoupon}
											type="submit"
											class="flex h-8 w-12 cursor-pointer items-center justify-center border border-neutral-300"
										>
											<img
												src="/icons/search.svg"
												width="17px"
												height="18px"
												alt="Search Icon"
											/>
										</button>
									{/if}
								</div>
								<div class="flex items-center gap-3">
									<button
										onclick={() => {
											showAddCoupon = false;
											code = '';
										}}
										type="button"
										class="w-fit cursor-pointer text-xs font-medium text-neutral-900 underline"
										>Cancel</button
									>
									{#if couponErr}
										<span class="text-xs text-red-600">{couponErr}</span>
									{/if}
								</div>
							</div>
						{/if}
						{#if order.couponCode}
							<div class="flex flex-col gap-1">
								<span class="text-sm font-medium text-neutral-500"
									>{order.couponCode}</span
								>
								<button
									onclick={() => removeCouponUpdate()}
									type="button"
									class="w-fit cursor-pointer text-xs font-medium text-neutral-900 underline"
									>Remove</button
								>
							</div>
							<span class="text-sm font-medium text-red-500"
								>- $ {(!isNaN(Number(order.discount))
									? Number(order.discount)
									: 0
								).toFixed(2)}</span
							>
						{/if}
					</div>
				{/if}
				<div class="my-4 h-[1px] w-full bg-neutral-100"></div>
				<div class="flex w-full items-center justify-between">
					<span class="text-sm font-medium text-neutral-900">Total</span>
					<span class="text-sm font-medium text-neutral-900"
						>$ {(!isNaN(Number(order.total)) ? Number(order.total) : 0).toFixed(
							2
						)}</span
					>
				</div>

				{#if order.items.length > 0}
					<button
						type="submit"
						class="my-8 flex h-11 cursor-pointer items-center justify-center bg-neutral-900 text-sm font-medium text-white"
						>Place Order</button
					>
				{:else}
					<p class="mt-10 w-94.75 self-center text-center text-neutral-500">
						Your cart is empty. <a
							href={urlFiltered}
							class="text-neutral-900 underline">Start shopping now!</a
						>
					</p>
				{/if}
			</div>
		</div>
	</div>
</form>

<Loader {loading} />

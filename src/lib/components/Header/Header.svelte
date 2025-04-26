<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { countSubscribe } from '$lib/store/cart/subscribes/cart.subscribe';
	import { urlFilteredSubscribe } from '$lib/store/shop/subscribes/shop.subscribe';
	import { clerk } from '$lib/clerk/client';
	import { get } from 'svelte/store';
	import { getInitials } from '$lib/utils/getInitials';
	import Profile from '../Profile/Profile.svelte';

	let _clerk = get(clerk);
	let initials = $state('');

	let urlFiltered = $state('');
	urlFilteredSubscribe((prev) => (urlFiltered = prev));

	let count = $state(0);
	countSubscribe((prev) => (count = prev));

	let searchTerm = $state('');

	$effect(() => {
		searchTerm = page.url.searchParams.get('searchTerm') || '';
	});

	$effect(() => {
		if (_clerk?.isSignedIn) {
			if (_clerk.user) {
				const firstName = _clerk.user?.firstName;
				const lastName = _clerk.user?.lastName;
				initials = getInitials(firstName + ' ' + lastName);
			}
		}
	});

	function handleSearch(e: any) {
		e.preventDefault();
		const url = new URL(urlFiltered);
		if (e.key === 'Enter') {
			url.searchParams.set('page', '1');
			if (!searchTerm) {
				url.searchParams.delete('searchTerm');
			} else {
				url.searchParams.set('searchTerm', searchTerm);
			}

			goto(url, { invalidate: ['app:shop:products'] });
		}
	}
</script>

<header class="flex w-full flex-col items-center justify-center">
	<div
		class="flex h-10 w-full items-center justify-center gap-2.5 bg-black text-sm text-white"
	>
		<p>Get 25% OFF on your first order.</p>
		<a href="/#" class="font-medium hover:underline">Order Now</a>
	</div>
	<div
		class="flex h-21 w-279 items-center justify-between gap-21 border-b border-neutral-100"
	>
		<div class="flex items-center justify-between gap-26 pr-9.5">
			<div class="flex items-center gap-3">
				<img
					src="/img/logomark.png"
					alt="Logomark"
					width="40px"
					height="40px"
				/>
				<span class="text-xl font-extrabold">eCommerce</span>
			</div>
			<nav class="flex items-center gap-8">
				<a href="/" class="text-sm font-medium text-neutral-500 hover:underline"
					>Home</a
				>
				<a
					href={urlFiltered}
					class="text-sm font-medium text-neutral-500 hover:underline">Shop</a
				>
				<a
					href="/#"
					class="text-sm font-medium text-neutral-500 hover:underline">About</a
				>
				<a
					href="/#"
					class="text-sm font-medium text-neutral-500 hover:underline"
					>contact</a
				>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-end gap-8">
			<div
				class="flex h-11 w-66 items-center justify-center gap-4 border border-neutral-300 px-4"
			>
				<img
					src="/icons/search.svg"
					width="17px"
					height="18px"
					alt="Search Icon"
				/>
				<input
					onkeyup={handleSearch}
					value={searchTerm}
					oninput={(e) => (searchTerm = e.currentTarget.value)}
					type="text"
					placeholder="Search products"
					class="w-full text-sm font-medium text-neutral-500 outline-none"
				/>
			</div>
			<div class="relative">
				<a href="/cart" class=" text-sm font-medium text-neutral-500">
					<img
						src="/icons/shop.svg"
						width="18px"
						height="18px"
						alt="Shop Icon"
					/>
				</a>
				{#if count > 0}
					<span
						class="absolute -top-5 -right-5 flex size-6 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold text-neutral-900"
						>{count}</span
					>
				{/if}
			</div>
			{#if initials}
				<a href="/profile">
					<Profile {initials} />
				</a>
			{:else}
				<a
					href="/auth/login?redirect={encodeURIComponent(page.url.href)}"
					class="text-sm font-medium text-neutral-500"
				>
					<img
						src="/icons/user.svg"
						width="19px"
						height="19px"
						alt="User Icon"
					/>
				</a>
			{/if}
		</div>
	</div>
</header>

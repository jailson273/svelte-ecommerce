<script lang="ts">
	import { page } from '$app/state';
	import { signOut } from '$lib/clerk/client';

	const pathname = $derived(page.url.pathname);

	const { children } = $props();
	async function logout() {
		signOut({ redirectUrl: '/' });
	}
</script>

<div class="mx-auto flex w-279 gap-10 py-15">
	<nav class="flex flex-col gap-4">
		<a
			aria-disabled={pathname === '/profile'}
			href="/profile"
			class="flex h-10.25 w-53 items-center gap-2.5 pl-6 text-sm font-medium text-neutral-500 transition-all duration-300 hover:bg-neutral-100 aria-[disabled=true]:pointer-events-none aria-[disabled=true]:cursor-default aria-[disabled=true]:bg-neutral-100 aria-[disabled=true]:text-neutral-900"
		>
			<img src="/icons/account.svg" alt="delivery" width="18px" height="18px" />
			Account</a
		>
		<a
			aria-disabled={pathname === '/profile/orders'}
			href="/profile/orders"
			class="flex h-10.25 w-53 items-center gap-2.5 pl-6 text-sm font-medium text-neutral-500 transition-all duration-300 hover:bg-neutral-100 aria-[disabled=true]:pointer-events-none aria-[disabled=true]:cursor-default aria-[disabled=true]:bg-neutral-100 aria-[disabled=true]:text-neutral-900"
		>
			<img src="/icons/shop.svg" alt="shop" width="18px" height="18px" />
			Orders</a
		>
		<a
			aria-disabled={pathname === '/profile/wishlist'}
			href="/profile/wishlist"
			class="flex h-10.25 w-53 items-center gap-2.5 pl-6 text-sm font-medium text-neutral-500 transition-all duration-300 hover:bg-neutral-100 aria-[disabled=true]:pointer-events-none aria-[disabled=true]:cursor-default aria-[disabled=true]:bg-neutral-100 aria-[disabled=true]:text-neutral-900"
		>
			<img src="/icons/heart.svg" alt="heart" width="18px" height="18px" />
			Wishlist</a
		>
		<a
			aria-disabled={pathname === '/profile/address'}
			href="/profile/address"
			class="flex h-10.25 w-53 items-center gap-2.5 pl-6 text-sm font-medium text-neutral-500 transition-all duration-300 hover:bg-neutral-100 aria-[disabled=true]:pointer-events-none aria-[disabled=true]:cursor-default aria-[disabled=true]:bg-neutral-100 aria-[disabled=true]:text-neutral-900"
		>
			<img
				src="/icons/delivery-light.svg"
				alt="delivery-light"
				width="18px"
				height="18px"
			/>
			Address</a
		>
		<a
			aria-disabled={pathname === '/profile/password'}
			href="/profile/password"
			class="flex h-10.25 w-53 items-center gap-2.5 pl-6 text-sm font-medium text-neutral-500 transition-all duration-300 hover:bg-neutral-100 aria-[disabled=true]:pointer-events-none aria-[disabled=true]:cursor-default aria-[disabled=true]:bg-neutral-100 aria-[disabled=true]:text-neutral-900"
		>
			<img src="/icons/key.svg" alt="delivery" width="18px" height="18px" />
			Password</a
		>
		<button
			onclick={logout}
			class="flex h-10.25 w-53 cursor-pointer items-center gap-2.5 pl-6 text-sm font-medium text-neutral-500 transition-all duration-300 hover:underline"
		>
			<img src="/icons/logout.svg" alt="delivery" width="18px" height="18px" />
			Logout</button
		>
	</nav>
	<div class="h-full w-0.25 bg-neutral-200"></div>
	<section class="flex flex-col">
		{@render children()}
	</section>
</div>

<script lang="ts">
	let error = $state('');
	let success = $state('');
	let isSubmiting = $state(false);
	let email = $state('');

	async function subscribe(event: Event) {
		event.preventDefault();
		error = '';
		success = '';
		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		if (!formData.get('email')) {
			error = 'Please enter a valid email address.';
			return;
		}
		isSubmiting = true;
		const resp = await fetch(form.action, {
			method: form.method,
			body: formData
		});
		const data = await resp.json();
		if (data?.error) {
			success = '';
			error = data.error;
		}

		if (data?.success) {
			email = '';
			error = '';
			success = data.success;
		}
		isSubmiting = false;
	}

	$effect(() => {
		if (success) {
			const time = setTimeout(() => (success = ''), 5000);
			return () => clearTimeout(time);
		}
	});
</script>

<footer class="flex w-full flex-col">
	<div
		class="flex h-50 w-full items-center justify-center gap-63.25 bg-neutral-100"
	>
		<div class="flex flex-col gap-6">
			<h3 class="text-2xl font-bold">Join Our Newsletter</h3>
			<p class="text-sm text-neutral-500">
				We love to surprise our subscribers with occasional gifts.
			</p>
		</div>
		<form
			class="flex h-12.5 flex-col gap-1"
			method="POST"
			action="/api/newsletter"
			onsubmit={subscribe}
		>
			<div class="flex gap-4">
				<input
					disabled={isSubmiting}
					type="email"
					name="email"
					value={email}
					oninput={(e) => (email = e.currentTarget.value)}
					placeholder="Enter your e-mail to subscribe"
					class="h-11.25 w-80 border border-neutral-300 px-4 text-sm font-medium text-neutral-500 outline-none focus:bg-white"
				/>
				<button
					disabled={isSubmiting}
					type="submit"
					class="flex h-11.25 w-29 cursor-pointer items-center justify-center bg-black text-sm font-medium text-white"
				>
					{#if isSubmiting}
						<div
							class="size-5 animate-spin rounded-full border-2 border-white border-t-black"
						></div>
					{/if}
					{#if !isSubmiting}
						Subscribe
					{/if}
				</button>
			</div>
			{#if success && !error}
				<span class="text-xs text-green-600">{success}</span>
			{/if}
			{#if error}
				<span class="text-xs text-red-600">{error}</span>
			{/if}
		</form>
	</div>
	<div class="flex items-center justify-center pt-18.5 pb-25.5">
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-4">
				<img
					src="/img/footer-logomark.png"
					alt="Logomark on footer"
					width="44px"
					height="44px"
				/>
				<span class="text-xl font-extrabold">eCommerce</span>
			</div>
			<p class="w-68 text-sm text-neutral-500">
				DevCut is a YouTube channel for practical project-based learning.
			</p>
			<div class="mt-5 flex items-center gap-6">
				<a
					href="/#"
					class="flex items-center justify-center p-0.5"
					target="_blank"
				>
					<img
						src="/icons/github.svg"
						alt="GitHub icon"
						width="20px"
						height="20px"
					/>
				</a>
				<a
					href="/#"
					class="flex items-center justify-center p-0.5"
					target="_blank"
				>
					<img
						src="/icons/instagram.svg"
						alt="Instagram icon"
						width="20px"
						height="20px"
					/>
				</a>
				<a
					href="/#"
					class="flex items-center justify-center p-0.5"
					target="_blank"
				>
					<img
						src="/icons/youtube.svg"
						alt="YouTube icon"
						width="20px"
						height="14px"
					/>
				</a>
			</div>
		</div>
		<div class="ml-24.5 flex gap-18">
			<div class="flex flex-col">
				<p class="text-sm font-medium text-neutral-400">SUPPORT</p>
				<nav
					class="mt-10 flex flex-col gap-4 text-sm font-medium text-neutral-500"
				>
					<a href="/#" class="hover:underline">FAQ</a>
					<a href="/#" class="hover:underline">Terms of use</a>
					<a href="/#" class="hover:underline">Privacy Policy</a>
				</nav>
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium text-neutral-400">COMPANY</p>
				<nav
					class="mt-10 flex flex-col gap-4 text-sm font-medium text-neutral-500"
				>
					<a href="/#" class="hover:underline">About us</a>
					<a href="/#" class="hover:underline">Contact</a>
					<a href="/#" class="hover:underline">Careers</a>
				</nav>
			</div>
			<div class="flex flex-col">
				<p class="text-sm font-medium text-neutral-400">SHOP</p>
				<nav
					class="mt-10 flex flex-col gap-4 text-sm font-medium text-neutral-500"
				>
					<a href="/#" class="hover:underline">My Account</a>
					<a href="/checkout" class="hover:underline">Checkout</a>
					<a href="/#" class="hover:underline">Cart</a>
				</nav>
			</div>
		</div>
		<div class="mb-auto ml-39.75 flex flex-col gap-10">
			<p class="text-sm font-medium text-neutral-400">ACCEPTED PAYMENTS</p>
			<div class="flex items-center gap-6">
				<img
					src="/img/mastercard.png"
					alt="Mastercard"
					width="30.03px"
					height="32px"
				/>
				<img src="/img/amex.png" alt="Amex Card" width="53px" height="32px" />
				<img src="/img/visa.png" alt="Visa card" width="42px" height="32px" />
			</div>
		</div>
	</div>

	<div class="flex w-full justify-center">
		<div
			class="flex h-19.75 w-279 items-center justify-center border-t border-neutral-200 text-sm text-neutral-500"
		>
			© 2023 DevCut. All rights reserved.
		</div>
	</div>
</footer>

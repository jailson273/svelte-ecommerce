<script lang="ts">
	import { clerk } from '$lib/clerk/client';
	import Profile from '$lib/components/Profile/Profile.svelte';
	import { getInitials } from '$lib/utils/getInitials';
	import { get } from 'svelte/store';

	interface AccountError {
		fullName?: string;
		email?: string;
	}

	let _clerk = get(clerk);
	let initials = $state('');

	let fullName = $state('');
	let email = $state('');

	let errors = $state<AccountError>({});

	$effect(() => {
		if (_clerk?.isSignedIn) {
			if (_clerk.user) {
				const firstName = _clerk.user?.firstName;
				const lastName = _clerk.user?.lastName;
				fullName = firstName + ' ' + lastName;
				email = _clerk.user?.emailAddresses[0]?.emailAddress;
				initials = getInitials(fullName);
			}
		}
	});
</script>

<h2 class="text-[16px] font-semibold text-neutral-900">Account Details</h2>

<div class="my-10">
	<Profile {initials} />
</div>

<form onsubmit={(e) => e.preventDefault()} class="flex w-80 flex-col gap-4">
	<div class="flex flex-1 flex-col gap-1">
		<label for="fullname" class="text-sm font-medium text-neutral-600"
			>Full name</label
		>
		<input
			oninput={(e) => (fullName = e.currentTarget.value)}
			value={fullName}
			type="text"
			id="fullname"
			placeholder="Enter your street"
			class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
		/>
		{#if errors.fullName}
			<p class="flex text-xs text-red-600">{errors.fullName}</p>
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-1">
		<label for="fullname" class="text-sm font-medium text-neutral-600"
			>Email</label
		>
		<input
			oninput={(e) => (fullName = e.currentTarget.value)}
			value={email}
			type="text"
			id="email"
			placeholder="Enter your street"
			class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
		/>
		{#if errors.email}
			<p class="flex text-xs text-red-600">{errors.email}</p>
		{/if}
	</div>

	<button
		type="submit"
		class="mt-12 flex h-11 w-36 cursor-pointer items-center justify-center bg-neutral-900 text-sm font-medium text-white"
		>Save Changes</button
	>
</form>

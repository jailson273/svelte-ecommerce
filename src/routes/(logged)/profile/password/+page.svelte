<script lang="ts">
	// import { clerk } from '$lib/clerk/client';
	// import { get } from 'svelte/store';
	// let _clerk = get(clerk);

	interface ChangePasswordError {
		password?: string;
		confirmPassword?: string;
	}

	let password = $state('');
	let confirmPassword = $state('');

	let errors = $state<ChangePasswordError>({});
</script>

<h2 class="text-[16px] font-semibold text-neutral-900">Change Password</h2>

<form
	onsubmit={(e) => e.preventDefault()}
	class="mt-10 flex w-80 flex-col gap-4"
>
	<div class="flex flex-1 flex-col gap-1">
		<label for="password" class="text-sm font-medium text-neutral-600"
			>New Password</label
		>
		<input
			oninput={(e) => (password = e.currentTarget.value)}
			value={password}
			type="password"
			id="password"
			placeholder="Enter your new password"
			class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
		/>
		{#if errors.password}
			<p class="flex text-xs text-red-600">{errors.password}</p>
		{/if}
	</div>

	<div class="flex flex-1 flex-col gap-1">
		<label for="confirm-password" class="text-sm font-medium text-neutral-600"
			>Confirm Password</label
		>
		<input
			oninput={(e) => (confirmPassword = e.currentTarget.value)}
			value={confirmPassword}
			type="password"
			id="confirm-password"
			placeholder="Confirm your password"
			class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
		/>
		{#if errors.confirmPassword}
			<p class="flex text-xs text-red-600">{errors.confirmPassword}</p>
		{/if}
	</div>

	<button
		type="submit"
		class="mt-12 flex h-11 w-36 cursor-pointer items-center justify-center bg-neutral-900 text-sm font-medium text-white"
		>Change password</button
	>
</form>

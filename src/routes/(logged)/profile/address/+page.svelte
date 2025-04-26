<script lang="ts">
	import { userId } from '$lib/clerk/client';
	import Spinner from '$lib/components/Spinner/Spinner.svelte';
	import type { Address } from '$lib/models/Address';

	let _userId = $state<number | null>(null);

	userId.subscribe((prev) => (_userId = prev));

	let isSubmiting = $state(false);

	let isLoadingZipCode = $state(false);
	let errors: Partial<Record<keyof Address, string>> = $state({});

	let address: Address = $state({
		zipCode: '',
		city: '',
		district: '',
		state: '',
		street: '',
		complement: '',
		number: '',
		country: ''
	});

	function onUpdateAddress(field: keyof Address, value: string) {
		errors[field] = '';
		address[field] = value;
		if (field === 'zipCode') {
			address.zipCode = maskZipCode(value);
		}
		if (field === 'city') {
			address.state = value.split(' ')[1];
		}
		if (field === 'number') {
			address.number = value.replace(/\D/g, '');
		}
		if (field === 'complement') {
			address.complement = value;
		}
		if (field === 'country') {
			address.country = value;
		}
		if (field === 'district') {
			address.district = value;
		}
		if (field === 'street') {
			address.street = value;
		}
	}

	function maskZipCode(value: string) {
		const onlyNumbers = value.replace(/\D/gi, '');
		return onlyNumbers.replace(/(\d{5})(\d{1,3})/, '$1-$2');
	}

	function oninput(e: any) {
		errors.zipCode = '';
		address.zipCode = e.target.value;
		if (!address.zipCode) {
			return;
		}
		const onlyNumbers = address.zipCode.replace(/-/g, '');
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
				// errors = { number: errors?.number };

				address.zipCode = data.cep;
				address.street = data.logradouro;
				address.district = data.bairro;
				address.city = data.localidade;
				address.state = data.uf;
				address.country = 'Brazil';
				address.number = '';
				address.complement = '';
			})
			.catch(() => (errors.zipCode = 'Oops, try again'))
			.finally(() => (isLoadingZipCode = false));
	}

	async function onsubmit(e: Event) {
		e.preventDefault();

		Object.keys(address)?.forEach((key) => {
			if (!address[key]?.trim()) {
				errors[key] = 'This field is required';
			} else {
				errors[key] = '';
			}
		});

		if (Object.keys(errors).some((key) => Boolean(errors[key]))) return;

		isSubmiting = true;

		const form = new FormData();
		form.append('zipCode', address.zipCode);
		form.append('street', address.street);
		form.append('district', address.district);
		form.append('city', address.city);
		form.append('state', address.state);
		form.append('country', address.country);
		form.append('number', address.number);
		form.append('complement', address?.complement || '');

		fetch(`/api/user/${_userId}/address`, {
			method: 'PUT',
			body: form
		})
			.catch((error) => {
				console.error('Error updating address:', error);
			})
			.finally(() => (isSubmiting = false));

		isSubmiting = false;
	}

	$effect(() => {
		if (_userId) {
			fetch(`/api/user/${_userId}/address`)
				.then((response) => response.json())
				.then((data) => {
					address = data;
				})
				.catch((error) => {
					console.error('Error fetching address:', error);
				});
		}
	});
</script>

<h2 class="text-[16px] font-semibold text-neutral-900">Address</h2>
<form class="flex flex-col gap-4" {onsubmit}>
	<div class="mt-16 flex flex-col gap-3.75">
		<div class="flex w-1/2 flex-col gap-1">
			<label for="zip-code" class="text-sm font-medium text-neutral-600"
				>Zip Code</label
			>
			<div class="relative flex items-center">
				<input
					disabled={isLoadingZipCode || isSubmiting}
					value={maskZipCode(address.zipCode)}
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
					disabled={isLoadingZipCode || isSubmiting}
					onchange={(e) => onUpdateAddress('street', e.currentTarget.value)}
					value={address.street}
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
						disabled={isLoadingZipCode || isSubmiting}
						onchange={(e) => onUpdateAddress('city', e.currentTarget.value)}
						value={address.city}
						type="text"
						id="city"
						placeholder="Enter your city"
						class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
					/>
					<span class=" absolute right-4 text-sm font-semibold text-neutral-300"
						>{address.state}</span
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
					disabled={isLoadingZipCode || isSubmiting}
					onchange={(e) => onUpdateAddress('district', e.currentTarget.value)}
					value={address.district}
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
					disabled={isLoadingZipCode || isSubmiting}
					onchange={(e) => onUpdateAddress('number', e.currentTarget.value)}
					value={address.number}
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
					disabled={isLoadingZipCode || isSubmiting}
					onchange={(e) => onUpdateAddress('complement', e.currentTarget.value)}
					value={address.complement}
					type="text"
					id="complement"
					placeholder="Your complement"
					class="h-12 w-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 focus:outline-none"
				/>
			</div>
		</div>
	</div>
	<button
		disabled={isSubmiting}
		type="submit"
		class="my-16.75 flex h-11 w-32 cursor-pointer items-center justify-center gap-3 bg-neutral-900 text-sm font-medium text-white"
	>
		{#if isSubmiting}
			<Spinner class="size-5 text-white" />
		{/if}
		Save Changes</button
	>
</form>

import type { Address } from '$lib/models/Address';
import { cart } from '../cart.store';

export function addressCartUpdate(address: Address) {
	cart.update((prev) => {
		prev.address = address;
		return prev;
	});
}

export function addressCartReset() {
	cart.update((prev) => {
		prev.address = {
			zipCode: '',
			city: '',
			district: '',
			state: '',
			street: '',
			number: null,
			complement: null
		};
		return prev;
	});
}

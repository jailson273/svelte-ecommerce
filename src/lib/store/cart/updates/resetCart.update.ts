import { cart } from '../cart.store';

export function resetCartUpdate() {
	cart.update((prev) => {
		prev.count = 0;
		prev.subtotal = 0;
		prev.items = [];

		return prev;
	});
}

import { cart } from '../cart.store';

export function taxCartUpdate(tax: number) {
	cart.update((prev) => {
		prev.tax = tax;
		return prev;
	});
}

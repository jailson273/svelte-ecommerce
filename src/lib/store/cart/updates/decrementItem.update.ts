import { cart } from '../cart.store';

export function decrementItemCart(id: string) {
	cart.update((prev) => {
		const index = prev.items.findIndex((i) => i.id === id);
		if (index === -1) return prev;
		const item = prev.items[index];
		prev.count--;
		prev.subtotal -= item.price;
		item.quantity--;
		prev.items[index] = item;
		return prev;
	});
}

import { cart } from '../cart.store';

export function removeItemCart(id: string) {
	cart.update((prev) => {
		const index = prev.items.findIndex((item) => item.id === id);
		if (index === -1) return prev;
		const item = prev.items[index];
		prev.count -= item.quantity;
		prev.subtotal -= item.price * item.quantity;
		prev.items.splice(index, 1);
		return prev;
	});
}

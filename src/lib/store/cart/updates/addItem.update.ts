import type { CartItem } from '$lib/models/CartItem';
import { generateId } from '$lib/utils/generateId';
import { cart } from '../cart.store';

export function addItemCart(item: Omit<CartItem, 'id'>) {
	const cartItem: CartItem = {
		...item,
		id: generateId()
	};

	cart.update((prev) => {
		prev.count += cartItem.quantity;
		prev.subtotal += cartItem.price * cartItem.quantity;

		const index = prev.items.findIndex(
			(i) =>
				i.productId === cartItem.productId &&
				i.size === cartItem.size &&
				i.color.name === cartItem.color.name
		);

		if (index === -1) {
			prev.items.push(cartItem);
			return prev;
		}

		const item = prev.items[index];
		item.quantity += cartItem.quantity;
		item.price += cartItem.price * cartItem.quantity;
		prev.items[index] = item;

		return prev;
	});
}

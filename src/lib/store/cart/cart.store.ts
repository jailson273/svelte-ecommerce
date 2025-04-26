import type { Cart } from '$lib/models/Cart';
import { OrderStatus } from '$lib/models/OrderStatus';
import { writable, get } from 'svelte/store';
import { userId } from '$lib/clerk/client';
import type { OrderItem } from '$lib/models/OrderItem';
import type { Order } from '$lib/models/Order';
import type { Coupon } from '$lib/models/Coupon';

export const cart = writable<Cart>({
	loading: false,
	tax: 0,
	count: 0,
	items: [],
	subtotal: 0,
	coupon: {
		id: 0,
		code: '',
		discount: 0
	},
	order: {
		id: 0,
		userId: 0,
		startDate: '',
		placedOrderDate: null,
		couponCode: null,
		discount: 0,
		tax: 0,
		total: 0,
		subtotal: 0,
		items: [],
		status: OrderStatus.draft,
		zipCode: '',
		street: '',
		district: '',
		city: '',
		state: '',
		country: '',
		number: '',
		complement: ''
	}
});

function updateLoading(loading: boolean) {
	cart.update((prev) => {
		prev.loading = loading;
		return prev;
	});
}

export async function loadOrder() {
	const _userId = get(userId);
	if (_userId) {
		updateLoading(true);
		const respOrder = await fetch(`/api/user/${_userId}/order`);
		const dataOrder = await respOrder.json();
		const respItems = await fetch(
			`/api/user/${_userId}/order/${dataOrder?.id}/item`
		);
		const dataItems: OrderItem[] = await respItems.json();

		if (dataOrder) {
			cart.update((prev) => {
				prev.loading = false;
				prev.count = dataItems.reduce((qtd, curr) => qtd + curr.quantity, 0);
				prev.order = {
					id: dataOrder.id,
					userId: dataOrder.userId,
					startDate: dataOrder.startDate,
					placedOrderDate: dataOrder.placedOrderDate,
					couponCode: dataOrder.couponCode,
					discount: dataOrder.discount,
					tax: dataOrder.tax,
					total: dataOrder.total,
					subtotal: dataOrder.subtotal,
					status: dataOrder.status,
					items: dataItems,
					zipCode: dataOrder.zipCode,
					street: dataOrder.street,
					district: dataOrder.district,
					city: dataOrder.city,
					state: dataOrder.state,
					country: dataOrder.country,
					number: dataOrder.number,
					complement: dataOrder.complement
				};
				return prev;
			});
		}
		updateLoading(false);
	}
}

export async function createOrderDraft() {
	const _userId = get(userId);
	if (!_userId) return;
	await fetch(`/api/user/${_userId}/order`, {
		method: 'POST'
	});
	await loadOrder();
}

export async function addItemToOrder(item: Omit<OrderItem, 'id' | 'orderId'>) {
	updateLoading(true);
	const _cart = get(cart);
	const _userId = get(userId);
	if (!_cart.order.id) {
		await createOrderDraft();
	}
	const form = new FormData();
	form.set('orderId', String(_cart.order!.id));
	form.set('productId', String(item.productId));
	form.set('colorId', String(item.colorId));
	form.set('sizeId', String(item.sizeId));
	form.set('quantity', String(item.quantity));
	await fetch(`/api/user/${_userId}/order/${_cart.order!.id}/item`, {
		method: 'POST',
		body: form
	});
	await loadOrder();
	updateLoading(false);
}

export async function removeItem(itemId: number) {
	updateLoading(true);
	const _cart = get(cart);
	const _userId = get(userId);
	await fetch(`/api/user/${_userId}/order/${_cart.order.id}/item/${itemId}`, {
		method: 'DELETE'
	});
	await loadOrder();
	updateLoading(false);
}

async function updateItem(itemId: number, quantity: number) {
	updateLoading(true);
	const _cart = get(cart);
	const _userId = get(userId);
	const form = new FormData();
	form.set('quantity', String(quantity));
	await fetch(`/api/user/${_userId}/order/${_cart.order.id}/item/${itemId}`, {
		method: 'PUT',
		body: form
	});
	await loadOrder();
	updateLoading(false);
}

export async function increment(itemId: number) {
	const _cart = get(cart);
	const item = _cart.order.items.find((i) => i.id === itemId);
	if (!item) return;
	await updateItem(itemId, item.quantity + 1);
}

export async function decrement(itemId: number) {
	const _cart = get(cart);
	const item = _cart.order.items.find((i) => i.id === itemId);
	if (!item) return;
	await updateItem(itemId, item.quantity - 1);
}

export function addressOrderUpdate(
	address: Partial<
		Pick<
			Order,
			| 'tax'
			| 'zipCode'
			| 'street'
			| 'district'
			| 'city'
			| 'state'
			| 'country'
			| 'number'
			| 'complement'
		>
	>
) {
	cart.update((prev) => {
		Object.keys(address).forEach((key) => {
			if (key in prev.order) {
				(prev.order as any)[key] = address[key];
			}
		});

		return prev;
	});
}

export async function setCouponUpdate(coupon: Coupon) {
	const _userId = get(userId);
	const _order = get(cart).order;

	const form = new FormData();
	form.append('couponCode', coupon.code);
	form.append('discount', String(coupon.discount));

	await fetch(`/api/user/${_userId}/order/${_order.id}/coupon`, {
		method: 'PUT',
		body: form
	});

	loadOrder();
}

export async function removeCouponUpdate() {
	const _userId = get(userId);
	const _order = get(cart).order;

	const form = new FormData();
	form.append('couponCode', '');
	form.append('discount', String(0));

	await fetch(`/api/user/${_userId}/order/${_order.id}/coupon`, {
		method: 'PUT',
		body: form
	});

	loadOrder();
}

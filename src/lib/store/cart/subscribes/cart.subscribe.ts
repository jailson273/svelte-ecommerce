import { cart } from '../cart.store';
import type { CartItem } from '$lib/models/CartItem';
import type { Coupon } from '$lib/models/Coupon';
import type { Order } from '$lib/models/Order';

export const taxSubscribe = (cb: (tax: number) => void) =>
	cart.subscribe((prev) => cb(prev.tax));

export const countSubscribe = (cb: (count: number) => void) =>
	cart.subscribe((prev) => cb(prev.count));

export const itemsSubscribe = (cb: (items: CartItem[]) => void) =>
	cart.subscribe((prev) => cb(prev.items));

export const subtotalSubscribe = (cb: (subtotal: number) => void) =>
	cart.subscribe((prev) => cb(prev.subtotal));

export const couponSubscribe = (cb: (coupon: Coupon) => void) =>
	cart.subscribe((prev) => cb(prev.coupon));

export const orderSubscribe = (cb: (order: Order) => void) =>
	cart.subscribe((prev) => cb(prev.order));

export const loadingSubscribe = (cb: (loading: boolean) => void) =>
	cart.subscribe((prev) => cb(prev.loading));

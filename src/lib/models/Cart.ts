import type { CartItem } from './CartItem';
import type { Coupon } from './Coupon';
import type { Order } from './Order';

export interface Cart {
	loading: boolean;
	count: number;
	subtotal: number;
	items: CartItem[];
	coupon: Coupon;
	tax: number;
	order: Order;
}

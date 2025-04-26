import type { OrderItem } from './OrderItem';
import type { OrderStatus } from './OrderStatus';

export interface Order {
	id: number;
	userId: number;
	startDate: string;
	placedOrderDate?: string | null;
	couponCode?: string | null;
	discount: number;
	tax: number;
	total: number;
	subtotal: number;
	status: OrderStatus;
	items: OrderItem[];
	zipCode?: string | null;
	street?: string | null;
	district?: string | null;
	city?: string | null;
	state?: string | null;
	country?: string | null;
	number?: string | null;
	complement?: string | null;
}

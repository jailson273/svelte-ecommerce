import type { Order } from '$lib/models/Order';
import { OrderStatus } from '$lib/models/OrderStatus';
import { type DbContext } from '$lib/server/db';
import { order, orderItem } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';

export class GetOrderByIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(orderId: number): Promise<ReturnAsync<Order, string>> {
		const _order = this.db
			.select()
			.from(order)
			.where(eq(order.id, orderId))
			.limit(1)
			.get();

		if (!_order) return [null, null];

		const _items = this.db
			.select()
			.from(orderItem)
			.where(eq(orderItem.orderId, orderId))
			.all();

		return [
			{
				id: _order.id,
				userId: _order.userId,
				startDate: _order.startDate,
				placedOrderDate: _order.placedOrderDate,
				couponCode: _order.couponCode,
				discount: Number(_order.discount),
				tax: Number(_order.tax),
				total: Number(_order.total),
				subtotal: Number(_order.subtotal),
				status: _order.status as OrderStatus,
				zipCode: _order.zipCode,
				street: _order.street,
				district: _order.district,
				city: _order.city,
				state: _order.state,
				country: _order.country,
				number: _order.number,
				complement: _order.complement,
				items: _items
			},
			null
		];
	}
}

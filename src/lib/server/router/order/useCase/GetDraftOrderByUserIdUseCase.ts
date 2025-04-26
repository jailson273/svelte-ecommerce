import type { Order } from '$lib/models/Order';
import { OrderStatus } from '$lib/models/OrderStatus';
import { type DbContext } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq, and } from 'drizzle-orm';

export class GetDraftOrderByUserIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(
		userId: number
	): Promise<ReturnAsync<Omit<Order, 'items'>, string>> {
		const _order = this.db
			.select()
			.from(order)
			.where(and(eq(order.userId, userId), eq(order.status, OrderStatus.draft)))
			.limit(1)
			.get();

		if (!_order) return [null, null];

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
				complement: _order.complement
			},
			null
		];
	}
}

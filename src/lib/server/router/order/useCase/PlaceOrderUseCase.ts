import { OrderStatus } from '$lib/models/OrderStatus';
import type { DbContext } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { and, eq } from 'drizzle-orm';

export class PlaceOrderUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(orderId: number): Promise<ReturnAsync<boolean, string>> {
		const _order = this.db
			.select({
				id: order.id,
				status: order.status
			})
			.from(order)
			.where(and(eq(order.id, orderId), eq(order.status, OrderStatus.draft)))
			.limit(1)
			.get();

		if (!_order) return [null, 'Order not found or not in draft status'];

		await this.db
			.update(order)
			.set({
				status: OrderStatus.received,
				placedOrderDate: new Date().toISOString().split('T').join(' ')
			})
			.where(eq(order.id, orderId))
			.execute();

		return [true, null];
	}
}

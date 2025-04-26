import { type DbContext } from '$lib/server/db';
import { order, orderItem } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { and, eq } from 'drizzle-orm';
import type { UpdateAmountOrderUseCase } from './UpdateAmountOrderUseCase';

export interface RemoveItemOnOrderParams {
	orderItemId: number;
	orderId: number;
}

export class RemoveItemOrderUseCase {
	constructor(
		private readonly db: DbContext,
		private readonly updateAmountOrder: UpdateAmountOrderUseCase
	) {}

	async execute({
		orderItemId,
		orderId
	}: RemoveItemOnOrderParams): Promise<ReturnAsync<boolean, string>> {
		const _orderItem = this.db
			.select({
				id: orderItem.id,
				quantity: orderItem.quantity,
				price: orderItem.price
			})
			.from(orderItem)
			.where(and(eq(orderItem.id, orderItemId), eq(orderItem.orderId, orderId)))
			.limit(1)
			.get();

		if (!_orderItem) return [null, 'Item not found'];

		const _order = this.db
			.select({
				id: order.id,
				total: order.total,
				subtotal: order.subtotal,
				tax: order.tax,
				discount: order.discount
			})
			.from(order)
			.where(eq(order.id, orderId))
			.limit(1)
			.get();

		if (!_order) return [null, 'Order not found'];

		this.db.delete(orderItem).where(eq(orderItem.id, orderItemId)).execute();

		await this.updateAmountOrder.execute(orderId);

		return [true, null];
	}
}

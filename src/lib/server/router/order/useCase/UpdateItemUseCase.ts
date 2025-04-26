import type { DbContext } from '$lib/server/db';
import { order, orderItem } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';
import type { UpdateAmountOrderUseCase } from './UpdateAmountOrderUseCase';

export class UpdateItemUseCase {
	constructor(
		private readonly db: DbContext,
		private readonly updateAmountOrder: UpdateAmountOrderUseCase
	) {}

	async execute(
		orderItemId: number,
		quantity: number
	): ReturnAsync<boolean, string> {
		const _orderItem = this.db
			.select()
			.from(orderItem)
			.where(eq(orderItem.id, orderItemId))
			.limit(1)
			.get();

		if (!_orderItem) {
			return [null, 'Item not found'];
		}

		if (quantity <= 0) {
			await this.db
				.delete(orderItem)
				.where(eq(orderItem.id, orderItemId))
				.execute();

			await this.db
				.update(order)
				.set({ subtotal: String(0) })
				.where(eq(order.id, orderItem.orderId))
				.execute();

			return [true, null];
		}

		await this.db
			.update(orderItem)
			.set({ quantity })
			.where(eq(orderItem.id, orderItemId))
			.execute();

		await this.updateAmountOrder.execute(_orderItem.orderId);

		return [true, null];
	}
}

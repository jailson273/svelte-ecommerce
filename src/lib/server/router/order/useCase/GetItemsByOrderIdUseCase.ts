import type { OrderItem } from '$lib/models/OrderItem';
import { type DbContext } from '$lib/server/db';
import { orderItem } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';

export class GetItemsByOrderIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(orderId: number): Promise<ReturnAsync<OrderItem[], string>> {
		const _order = this.db
			.select()
			.from(orderItem)
			.where(eq(orderItem.orderId, orderId))
			.all();

		return [_order, null];
	}
}

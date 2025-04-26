import type { Order } from '$lib/models/Order';
import { OrderStatus } from '$lib/models/OrderStatus';
import type { DbContext } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { and, eq, not, inArray } from 'drizzle-orm';

export class GetAllOrdersUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(userId: number): ReturnAsync<Omit<Order, 'items'>[], string> {
		const orders = this.db
			.select()
			.from(order)
			.where(
				and(
					eq(order.userId, userId),
					not(inArray(order.status, [OrderStatus.draft]))
				)
			)
			.all();
		return [orders as any, null];
	}
}

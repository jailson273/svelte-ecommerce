import type { DbContext } from '$lib/server/db';
import { order, orderItem } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq, sql } from 'drizzle-orm';

export class UpdateAmountOrderUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(orderId: number): Promise<ReturnAsync<boolean, string>> {
		const _order = this.db
			.select({
				id: order.id,
				total: order.total,
				tax: order.tax,
				discount: order.discount,
				subtotal: order.subtotal
			})
			.from(order)
			.where(eq(order.id, orderId))
			.limit(1)
			.get();

		if (!_order) return [null, 'Order nor found'];

		const result = this.db
			.select({
				subtotal: sql<number>`sum(${orderItem.price} * ${orderItem.quantity})`
			})
			.from(orderItem)
			.where(sql`${orderItem.orderId} = ${orderId}`)
			.get();

		const tax = !isNaN(Number(_order.tax)) ? Number(_order.tax) : 0;
		const discount = !isNaN(Number(_order.discount))
			? Number(_order.discount)
			: 0;

		const subtotal = result?.subtotal || 0;

		console.log('Subtotal', subtotal);

		const total = subtotal + tax - discount;
		console.log('total', total);

		await this.db
			.update(order)
			.set({ subtotal: String(subtotal), total: String(total) })
			.where(eq(order.id, orderId))
			.execute();

		console.log('Updated order', orderId);

		return [true, null];
	}
}

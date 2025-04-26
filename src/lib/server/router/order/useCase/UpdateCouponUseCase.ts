import type { DbContext } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';
import type { UpdateAmountOrderUseCase } from './UpdateAmountOrderUseCase';

interface UpdateCouponParams {
	orderId: number;
	couponCode: string;
	discount: number;
}

export class UpdateCouponUseCase {
	constructor(
		private readonly db: DbContext,
		private readonly updateAmountOrder: UpdateAmountOrderUseCase
	) {}

	async execute({
		orderId,
		couponCode,
		discount
	}: UpdateCouponParams): ReturnAsync<boolean, string> {
		this.db
			.update(order)
			.set({
				couponCode,
				discount: String(discount)
			})
			.where(eq(order.id, orderId))
			.execute();

		await this.updateAmountOrder.execute(orderId);

		return [true, null];
	}
}

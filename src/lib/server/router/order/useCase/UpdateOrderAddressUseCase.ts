import type { DbContext } from '$lib/server/db';
import { order } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';
import type { UpdateAmountOrderUseCase } from './UpdateAmountOrderUseCase';

interface UpdateOrderAddressInput {
	orderId: number;
	zipCode: string;
	street: string;
	district: string;
	city: string;
	state: string;
	country: string;
	number: string;
	complement: string;
	tax: number;
}

export class UpdateOrderAddressUseCase {
	constructor(
		private readonly db: DbContext,
		private readonly updateOrderAmount: UpdateAmountOrderUseCase
	) {}

	async execute({
		orderId,
		zipCode,
		street,
		district,
		city,
		state,
		country,
		number,
		complement,
		tax
	}: UpdateOrderAddressInput): ReturnAsync<boolean, string> {
		this.db
			.update(order)
			.set({
				zipCode,
				street,
				district,
				city,
				state,
				country,
				number,
				complement,
				tax: String(tax)
			})
			.where(eq(order.id, orderId))
			.execute();

		await this.updateOrderAmount.execute(orderId);

		return [true, null];
	}
}

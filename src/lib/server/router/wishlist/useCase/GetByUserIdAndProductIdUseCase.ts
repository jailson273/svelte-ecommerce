import type { DbContext } from '$lib/server/db';
import { wishlist } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { and, eq } from 'drizzle-orm';

export interface GetByUserIdAndProductIdParams {
	userId: number;
	productId: number;
}

export class GetByUserIdAndProductIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute({
		userId,
		productId
	}: GetByUserIdAndProductIdParams): ReturnAsync<boolean, string> {
		try {
			const product = this.db
				.select()
				.from(wishlist)
				.where(
					and(eq(wishlist.productId, productId), eq(wishlist.userId, userId))
				)
				.get();
			if (!product) return [false, null];

			return [true, null];
		} catch {
			return [null, 'Error creating user'];
		}
	}
}

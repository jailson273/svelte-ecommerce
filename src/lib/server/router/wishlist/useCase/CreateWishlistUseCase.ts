import type { DbContext } from '$lib/server/db';
import { wishlist } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq, and } from 'drizzle-orm';

export interface CreateWishlistInput {
	userId: number;
	productId: number;
}

export class CreateWishlistUseCase {
	constructor(private readonly db: DbContext) {}

	async execute({
		userId,
		productId
	}: CreateWishlistInput): ReturnAsync<boolean, string> {
		const userExist = this.db
			.select()
			.from(wishlist)
			.where(
				and(eq(wishlist.productId, productId), eq(wishlist.userId, userId))
			)
			.get();

		if (userExist) {
			return [true, null];
		}

		try {
			this.db
				.insert(wishlist)
				.values({
					userId,
					productId,
					date: new Date().toISOString().split('T').join(' ')
				})
				.execute();

			return [true, null];
		} catch {
			return [null, 'Error creating user'];
		}
	}
}

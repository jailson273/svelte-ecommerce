import type { DbContext } from '$lib/server/db';
import { product, review, user } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';

export interface CreateReview {
	productId: number;
	userId: number;
	rating: number;
	description: string;
}

export class CreateReviewToProductUseCase {
	constructor(private readonly db: DbContext) {}

	async execute({
		productId,
		userId,
		rating,
		description
	}: CreateReview): ReturnAsync<boolean, string> {
		const productResult = this.db
			.select()
			.from(product)
			.where(eq(product.id, productId))
			.get();

		if (!productResult) {
			return [null, 'Product not found'];
		}

		const userResult = this.db
			.select()
			.from(user)
			.where(eq(user.id, userId))
			.get();

		if (!userResult) {
			return [null, 'User not found'];
		}

		await this.db
			.insert(review)
			.values({
				productId,
				userId,
				rating,
				description,
				date: new Date().toISOString().replace('T', ' ').substring(0, 19)
			})
			.execute();

		return [true, null];
	}
}

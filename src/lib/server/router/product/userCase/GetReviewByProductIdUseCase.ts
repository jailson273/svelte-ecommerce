import type { DbContext } from '$lib/server/db';
import { review, user } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export class GetReviewByProductIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(productId: number) {
		const reviews = this.db
			.select({
				id: review.id,
				description: review.description,
				rating: review.rating,
				date: review.date,
				userId: review.userId,
				productId: review.productId,
				name: user.name
			})
			.from(review)
			.where(eq(review.productId, productId))
			.innerJoin(user, eq(review.userId, user.id))
			.orderBy(desc(review.rating), desc(review.date))
			.all();

		return reviews;
	}
}

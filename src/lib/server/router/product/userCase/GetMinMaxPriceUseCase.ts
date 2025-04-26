import type { DbContext } from '$lib/server/db';
import { product } from '$lib/server/db/schema';
import { max, min } from 'drizzle-orm';

export class GetMinMaxPriceUseCase {
	constructor(private readonly db: DbContext) {}

	async execute() {
		return this.db
			.select({
				min: min(product.price),
				max: max(product.price)
			})
			.from(product)
			.get();
	}
}

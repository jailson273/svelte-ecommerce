import type { DbContext } from '$lib/server/db';
import { category } from '$lib/server/db/schema';

export class GetDistinctCategoryUseCase {
	constructor(private readonly db: DbContext) {}

	async execute() {
		return this.db.select().from(category).all();
	}
}

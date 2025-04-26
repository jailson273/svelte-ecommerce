import type { DbContext } from '$lib/server/db';
import { size } from '$lib/server/db/schema';

export class GetDistinctSizeUseCase {
	constructor(private readonly db: DbContext) {}

	async execute() {
		return this.db
			.select({
				id: size.id,
				name: size.name
			})
			.from(size)
			.groupBy(size.name)
			.all();
	}
}

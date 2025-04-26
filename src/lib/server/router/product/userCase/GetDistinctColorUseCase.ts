import type { DbContext } from '$lib/server/db';
import { color } from '$lib/server/db/schema';

export class GetDistinctColorUseCase {
	constructor(private readonly db: DbContext) {}

	async execute() {
		return this.db
			.select({
				id: color.id,
				name: color.name,
				hexadecimal: color.hexadecimal
			})
			.from(color)
			.groupBy(color.name, color.hexadecimal)
			.all();
	}
}

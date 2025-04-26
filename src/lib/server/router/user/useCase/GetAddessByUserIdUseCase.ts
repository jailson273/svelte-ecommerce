import type { Address } from '$lib/models/Address';
import type { DbContext } from '$lib/server/db';
import { address } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';

export class GetAddessByUserIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(userId: number): ReturnAsync<Address, string> {
		const addressResult = this.db
			.select()
			.from(address)
			.where(eq(address.userId, userId))
			.limit(1)
			.get();

		if (!addressResult) return [null, 'Address not found'];

		return [addressResult, null];
	}
}

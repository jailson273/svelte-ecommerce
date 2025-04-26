import type { DbContext } from '$lib/server/db';
import { address } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';

export interface UpdateAddressInput {
	userId: number;
	zipCode: string;
	street: string;
	district: string;
	city: string;
	state: string;
	country: string;
	number: string;
	complement: string;
}

export class UpdateAddressUseCase {
	constructor(private readonly db: DbContext) {}

	async execute({
		userId,
		zipCode,
		street,
		district,
		city,
		state,
		country,
		number,
		complement
	}: UpdateAddressInput): ReturnAsync<boolean, string> {
		console.log('UpdateAddressUseCase', userId);
		if (!userId) return [false, 'User ID is required'];

		try {
			await this.db.delete(address).where(eq(address.userId, userId)).execute();
			await this.db
				.insert(address)
				.values({
					userId,
					zipCode,
					street,
					district,
					city,
					state,
					country,
					number,
					complement
				})
				.execute();

			return [true, null];
		} catch (e: any) {
			console.log(e);
			return [null, e?.message];
		}
	}
}

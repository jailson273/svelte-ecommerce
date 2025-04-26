import type { User } from '$lib/models/User';
import type { DbContext } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq, or } from 'drizzle-orm';

export interface CreateUserInput {
	name: string;
	email: string;
	clerkId: string;
}

export class CreateUserUseCase {
	constructor(private readonly db: DbContext) {}

	async execute({
		clerkId,
		email,
		name
	}: CreateUserInput): ReturnAsync<User, string> {
		const userExist = this.db
			.select()
			.from(user)
			.where(or(eq(user.clerkId, clerkId), eq(user.email, email)))
			.get();

		if (userExist) {
			return [null, 'User already exists'];
		}

		try {
			const created = this.db
				.insert(user)
				.values({
					clerkId,
					email,
					name
				})
				.returning()
				.get();

			return [created, null];
		} catch {
			return [null, 'Error creating user'];
		}
	}
}

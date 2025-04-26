import type { DbContext } from '$lib/server/db';
import { newsletter } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class NewsletterSubscribeUseCase {
	constructor(private db: DbContext) {}

	async execute(email: string) {
		if (!email) return false;

		const createdAt = new Date().toISOString().split('T').join(' ');

		const existingEmail = this.db
			.select({
				email: newsletter.email
			})
			.from(newsletter)
			.where(eq(newsletter.email, email))
			.limit(1)
			.get();

		if (existingEmail) {
			return true;
		}

		const resp = await this.db.insert(newsletter).values({ email, createdAt });
		if (resp.changes) {
			return true;
		}

		return false;
	}
}

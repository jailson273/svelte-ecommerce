import type { DbContext } from '$lib/server/db';
import { NewsletterSubscribeUseCase } from './useCase/NewsletterSubscribeUseCase';

export class NewsLetterService {
	subscribe: NewsletterSubscribeUseCase;

	constructor(private db: DbContext) {
		this.subscribe = new NewsletterSubscribeUseCase(this.db);
	}
}

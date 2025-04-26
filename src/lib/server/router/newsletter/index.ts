import { db } from '$lib/server/db';
import { NewsLetterService } from './NewsletterService';

export const newsletterService = new NewsLetterService(db);

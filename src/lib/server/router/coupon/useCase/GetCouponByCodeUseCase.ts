import type { DbContext } from '$lib/server/db';
import { coupon } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class GetCouponByCodeUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(couponCode: string) {
		if (!couponCode) return undefined;
		const code = couponCode.toUpperCase();
		return this.db.select().from(coupon).where(eq(coupon.code, code)).get();
	}
}

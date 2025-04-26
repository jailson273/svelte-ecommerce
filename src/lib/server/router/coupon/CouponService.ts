import type { DbContext } from '$lib/server/db';
import { GetCouponByCodeUseCase } from './useCase/GetCouponByCodeUseCase';

export class CouponService {
	getCouponByCode: GetCouponByCodeUseCase;

	constructor(protected readonly db: DbContext) {
		this.getCouponByCode = new GetCouponByCodeUseCase(this.db);
	}
}

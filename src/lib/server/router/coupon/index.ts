import { db } from '$lib/server/db';
import { CouponService } from './CouponService';

export const couponService = new CouponService(db);

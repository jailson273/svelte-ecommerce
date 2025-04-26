import { type RequestHandler, json } from '@sveltejs/kit';
import { couponService } from '$lib/server/router/coupon';

export const GET: RequestHandler = async ({ params }) => {
	const code = params!.code as string;
	const coupon = await couponService.getCouponByCode.execute(code);
	if (!coupon) return json({ error: 'Coupon not found' }, { status: 404 });
	return json(coupon);
};

import { type RequestHandler, json } from '@sveltejs/kit';
import { orderService } from '$lib/server/router/order';

export const PUT: RequestHandler = async ({ params, request }) => {
	const orderId = Number(params.orderId);
	const form = await request.formData();

	const couponCode = form.get('couponCode') as string;
	const discount = Number(form.get('discount'));

	const [success, err] = await orderService.updateCoupon.execute({
		orderId,
		couponCode,
		discount
	});
	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}
	return json({ success });
};

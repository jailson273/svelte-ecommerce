import { type RequestHandler, json } from '@sveltejs/kit';
import { orderService } from '$lib/server/router/order';

export const PUT: RequestHandler = async ({ params }) => {
	const orderId = Number(params.orderId);
	const [success, err] = await orderService.placeOrder.execute(orderId);
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

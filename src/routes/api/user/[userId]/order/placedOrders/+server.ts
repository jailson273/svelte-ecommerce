import { type RequestHandler, json } from '@sveltejs/kit';
import { orderService } from '$lib/server/router/order';

export const GET: RequestHandler = async ({ params }) => {
	const userId = Number(params.userId);
	const [orders, err] = await orderService.getAllOrders.execute(userId);
	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json(orders);
};

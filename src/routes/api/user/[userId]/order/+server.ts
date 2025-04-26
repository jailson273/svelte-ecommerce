import { type RequestHandler, json } from '@sveltejs/kit';
import { orderService } from '$lib/server/router/order';

export const POST: RequestHandler = async ({ params }) => {
	const userId = Number(params.userId);
	const [created, err] = await orderService.createDraftOrder.execute(userId);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json({ id: created!.id });
};

export const GET: RequestHandler = async ({ params }) => {
	const userId = Number(params.userId);
	const [order, err] = await orderService.getDraftOrderByUserId.execute(userId);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json(order);
};

import { type RequestHandler, json } from '@sveltejs/kit';
import { orderService } from '$lib/server/router/order';

export const DELETE: RequestHandler = async ({ params }) => {
	const orderId = Number(params.orderId);
	const orderItemId = Number(params.itemId);
	const [success, err] = await orderService.removeItemOrder.execute({
		orderId,
		orderItemId
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

export const PUT: RequestHandler = async ({ request, params }) => {
	const formData = await request.formData();
	const quantity = formData.get('quantity');
	const itemId = Number(params.itemId);
	const [success, err] = await orderService.updateItem.execute(
		itemId,
		Number(quantity)
	);

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

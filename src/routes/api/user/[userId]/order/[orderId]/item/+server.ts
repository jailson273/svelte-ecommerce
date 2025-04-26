import { type RequestHandler, json } from '@sveltejs/kit';
import { orderService } from '$lib/server/router/order';

export const POST: RequestHandler = async ({ params, request }) => {
	const orderId = Number(params.orderId);
	const form = await request.formData();
	const colorId = form.get('colorId');
	const productId = form.get('productId');
	const sizeId = form.get('sizeId');
	const quantity = form.get('quantity');
	const [created, err] = await orderService.addItemOrder.execute({
		orderId,
		colorId: Number(colorId),
		productId: Number(productId),
		sizeId: Number(sizeId),
		quantity: Number(quantity)
	});

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
	const orderId = Number(params.orderId);
	const [items, err] = await orderService.getItemsByOrderId.execute(orderId);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json(items);
};

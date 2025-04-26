import { orderService } from '$lib/server/router/order';
import { json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request }) => {
	const orderId = Number(params.orderId);
	const form = await request.formData();

	const data = {
		orderId,
		zipCode: form.get('zipCode') as any,
		street: form.get('street') as any,
		city: form.get('city') as any,
		state: form.get('state') as any,
		country: form.get('country') as any,
		number: form.get('number') as any,
		complement: form.get('complement') as any,
		district: form.get('district') as any,
		tax: form.get('tax') as any
	};
	const [success, err] = await orderService.updateOrderAddress.execute(data);
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

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { orderService } from '$lib/server/router/order';
import { OrderStatus } from '$lib/models/OrderStatus';

export const load: PageServerLoad = async ({ params }) => {
	const [order] = await orderService.getOrderById.execute(
		Number(params.orderId)
	);
	if (!order) return error(404, 'Not found');

	if (order.status === OrderStatus.draft) {
		return redirect(302, '/checkout');
	}

	return {
		order
	};
};

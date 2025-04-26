import { wishlistService } from '$lib/server/router/wishlist';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const userId = formData.get('userId') as string;
	const productId = formData.get('productId') as string;

	const [created, err] = await wishlistService.createWishlist.execute({
		productId: Number(productId),
		userId: Number(userId)
	});

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json({ created });
};

export const GET: RequestHandler = async ({ url }) => {
	const userId = url.searchParams.get('userId');
	const productId = url.searchParams.get('productId');

	const [favorite, err] = await wishlistService.getByUserIdAndProductId.execute(
		{
			userId: Number(userId),
			productId: Number(productId)
		}
	);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json({ favorite });
};

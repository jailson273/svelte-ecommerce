import { type RequestHandler, json } from '@sveltejs/kit';
import { wishlistService } from '$lib/server/router/wishlist';

export const DELETE: RequestHandler = async ({ params }) => {

	const [success, err] = await wishlistService.deleteWishlist.execute(Number(params.id));

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

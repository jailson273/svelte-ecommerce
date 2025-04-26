import { wishlistService } from '$lib/server/router/wishlist';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const userId = Number(params.userId);
	const [favorites, err] = await wishlistService.getAllByUserId.execute(userId);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}
	return json(favorites);
};

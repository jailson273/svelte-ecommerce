import { type RequestHandler, json } from '@sveltejs/kit';
import { userService } from '$lib/server/router/user';

export const GET: RequestHandler = async ({ params }) => {
	const [user, err] = await userService.getUserByClerkId.execute(
		params.clerkId as string
	);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json({ user });
};

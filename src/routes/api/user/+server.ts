import { type RequestHandler, json } from '@sveltejs/kit';
import { userService } from '$lib/server/router/user';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const name = formData.get('name') as string;
	const email = formData.get('email') as string;
	const clerkId = formData.get('clerkId') as string;

	const [user, err] = await userService.createUser.execute({
		name,
		email,
		clerkId
	});

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

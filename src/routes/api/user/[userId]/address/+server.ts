import { userService } from '$lib/server/router/user';
import { json, type RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request }) => {
	const userId = Number(params.userId);
	const form = await request.formData();

	const data = {
		userId,
		zipCode: form.get('zipCode') as any,
		street: form.get('street') as any,
		city: form.get('city') as any,
		state: form.get('state') as any,
		country: form.get('country') as any,
		number: form.get('number') as any,
		complement: form.get('complement') as any,
		district: form.get('district') as any
	};
	const [success, err] = await userService.updateAddress.execute(data);
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

export const GET: RequestHandler = async ({ params }) => {
	const userid = Number(params.userId);
	const [address, err] = await userService.getAddessByUserId.execute(userid);

	if (err) {
		return json(
			{ error: err },
			{
				status: 400
			}
		);
	}

	return json(address);
};

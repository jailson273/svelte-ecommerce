import { type RequestHandler, json } from '@sveltejs/kit';
import { newsletterService } from '$lib/server/router/newsletter';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const email = formData.get('email');
	const resp = await newsletterService.subscribe.execute(String(email));
	if (!resp) {
		return json(
			{ error: 'Erro to register e-mail, try again.' },
			{ status: 400 }
		);
	}
	return json({ success: `Your e-mail was registered with success.` });
};

import type { PageServerLoad } from './$types';

import { productService } from '$lib/server/router/product';

export const load: PageServerLoad = async () => {
	try {
		const resp = await productService.getListProduct.execute({
			perPage: 4
		});

		return {
			products: resp.items
		};
	} catch {
		return { products: [] };
	}
};

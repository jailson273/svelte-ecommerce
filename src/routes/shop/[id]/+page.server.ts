import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product } from '$lib/models/Product';
import { productService } from '$lib/server/router/product';

export const load: PageServerLoad = async ({ params }) => {
	const product = await productService.getProductById.execute(
		Number(params.id)
	);
	if (!product) return error(404, 'Not found');

	const [reviews, relateds] = await Promise.all([
		productService.getReviewByProductId.execute(Number(params.id)),
		getRelatedProductsByCategory(product.category[0].name)
	]);

	return {
		product,
		reviews,
		relateds
	};
};

async function getRelatedProductsByCategory(
	category: string
): Promise<Omit<Product, 'colors' | 'sizes'>[]> {
	try {
		const resp = await productService.getListProduct.execute({
			perPage: 4,
			categories: [category]
		});
		return resp.items;
	} catch {
		return [];
	}
}

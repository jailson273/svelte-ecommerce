import { productService } from '$lib/server/router/product';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ depends, url }) => {
	depends('app:shop:products');
	const queryParams = {
		page: 1,
		perPage: 9,
		categories: [] as string[],
		colors: [] as string[],
		sizes: [] as string[],
		price: 0,
		searchTerm: '',
		orderBy: ''
	};

	Object.keys(queryParams).forEach((key) => {
		const value = url.searchParams.get(key);
		if (key === 'price' && !isNaN(Number(value)) && Number(value) > 0) {
			queryParams[key] = Number(value);
		}

		if (key === 'searchTerm' && value && value.trim() !== '') {
			queryParams[key] = value.trim();
		}

		if (key === '') {
			if (value && value.trim() !== '') {
				queryParams[key] = value.split(',');
			}
		}

		if (['categories', 'colors', 'sizes'].includes(key)) {
			if (value && value.trim() !== '') {
				queryParams[key] = value.split(',');
			}
		}

		if (key === 'perPage' && value && !isNaN(Number(value))) {
			queryParams[key] = Number(value);
			if (Number(value) < 1) queryParams[key] = 9;
			if (Number(value) > 27) queryParams[key] = 27;
		}

		if (key === 'page' && value && !isNaN(Number(value))) {
			queryParams[key] = Number(value);
			if (Number(value) < 1) queryParams[key] = 1;
		}

		if (key === 'orderBy' && value && value.trim() !== '') {
			queryParams[key] = value;
		}
	});

	const products = await productService.getListProduct.execute(queryParams);
	const categories = await productService.getDistinctCategory.execute();
	const sizes = await productService.getDistinctSize.execute();
	const price = await productService.getMinMaxPrice.execute();
	const colors = await productService.getDistinctColor.execute();

	return {
		products,
		filters: {
			categories,
			sizes,
			colors,
			price
		}
	};
};

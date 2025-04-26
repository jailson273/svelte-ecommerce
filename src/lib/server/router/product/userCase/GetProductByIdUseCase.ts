import type { Product } from '$lib/models/Product';
import type { DbContext } from '$lib/server/db';
import {
	category,
	product,
	color,
	size,
	image,
	productCategory
} from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export class GetProductByIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(id: number) {
		const productResult = this.db
			.select()
			.from(product)
			.where(eq(product.id, id))
			.get();

		if (!productResult) return null;

		const colorResult = this.db
			.select({
				id: color.id,
				name: color.name,
				hexadecimal: color.hexadecimal,
				productId: color.productId
			})
			.from(color)
			.where(eq(color.productId, id))
			.all();

		const sizeResult = this.db
			.select({
				id: size.id,
				name: size.name
			})
			.from(size)
			.where(eq(size.productId, id))
			.all();

		const categoryResult = this.db
			.select({
				id: category.id,
				name: category.name
			})
			.from(productCategory)
			.leftJoin(category, eq(productCategory.categoryId, category.id))
			.where(eq(productCategory.productId, id))
			.limit(1)
			.all();

		const imageResult = this.db
			.select({
				url: image.url
			})
			.from(image)
			.where(eq(image.productId, id))
			.all();

		const _product: Product = {
			id: productResult.id,
			name: productResult.name,
			description: productResult.description,
			price: Number(productResult.price),
			inStock: productResult.inStock,
			averageRating: productResult.averageRating,
			reviews: productResult.reviews,
			category: categoryResult as any,
			images: imageResult.map(({ url }) => url),
			sizes: sizeResult,
			colors: colorResult
		};
		return _product;
	}
}

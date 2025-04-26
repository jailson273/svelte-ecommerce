import type { DbContext } from '$lib/server/db';
import { image, product, wishlist } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq, inArray } from 'drizzle-orm';

interface WishlistProduct {
	id: number;
	productId: number;
	imageUrl: string;
	name: string;
	price: number;
	date: string;
}

export class GetAllByUserIdUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(userId: number): ReturnAsync<WishlistProduct[], string> {
		try {
			const _products = this.db
				.select({
					id: wishlist.id,
					productId: product.id,
					name: product.name,
					price: product.price,
					date: wishlist.date
				})
				.from(wishlist)
				.leftJoin(product, eq(wishlist.productId, product.id))
				.where(eq(wishlist.userId, userId))
				.all();

			const _images = this.db
				.select()
				.from(image)
				.where(
					inArray(
						image.productId,
						_products.map((p) => p.productId) as number[]
					)
				)
				.all();

			for (const product of _products) {
				const image = _images.find((i) => i.productId === product.productId);
				product['imageUrl'] = image?.url || '';
			}

			return [_products as any, null];
		} catch (e: any) {
			return [null, e.message];
		}
	}
}

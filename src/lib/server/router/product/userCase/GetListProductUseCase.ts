import type { List } from '$lib/models/List';
import type { Product } from '$lib/models/Product';
import type { QueryParams } from '$lib/models/QueryParams';
import { type DbContext } from '$lib/server/db';
import {
	category,
	product,
	color,
	size,
	image,
	productCategory
} from '$lib/server/db/schema';
import {
	and,
	asc,
	countDistinct,
	desc,
	eq,
	inArray,
	like,
	lte,
	or,
	SQL
} from 'drizzle-orm';

export interface ProductListParams extends QueryParams {
	categories?: string[];
	colors?: string[];
	sizes?: string[];
	price?: number;
	searchTerm?: string;
	orderBy?: string;
}

export class GetListProductUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(
		params: ProductListParams
	): Promise<List<Omit<Product, 'colors' | 'sizes'>>> {
		const {
			page,
			perPage,
			categories,
			colors,
			sizes,
			price,
			searchTerm,
			orderBy
		} = params;

		const resp: List<Omit<Product, 'colors' | 'sizes'>> = {
			page: page ?? 1,
			perPage: perPage ?? 9,
			count: 0,
			totalPages: 0,
			items: []
		};

		if (resp.page < 1) resp.page = 1;
		if (resp.perPage < 1) resp.perPage = 9;
		if (resp.perPage > 27) resp.perPage = 27;

		const conditions: SQL[] = [];
		if (categories?.length) {
			conditions.push(inArray(category.name, categories));
		}

		if (colors?.length) {
			conditions.push(inArray(color.name, colors));
		}

		if (sizes?.length) {
			conditions.push(inArray(size.name, sizes));
		}
		if (price) {
			conditions.push(lte(product.price, price.toString()));
		}
		if (searchTerm?.trim()) {
			const searchCondition = or(
				like(product.name, `%${searchTerm.trim()}%`),
				like(product.description, `%${searchTerm.trim()}%`)
			);

			if (searchCondition) {
				conditions.push(searchCondition);
			}
		}

		const resultCount = this.db
			.select({ count: countDistinct(product.id) })
			.from(product)
			.leftJoin(image, eq(product.id, image.productId))
			.leftJoin(size, eq(product.id, size.productId))
			.leftJoin(color, eq(product.id, color.productId))
			.leftJoin(productCategory, eq(product.id, productCategory.productId))
			.leftJoin(category, eq(productCategory.categoryId, category.id))
			.where(conditions.length ? and(...conditions) : undefined)
			.get();

		if (!resultCount?.count) {
			return resp;
		}

		resp.count = Number(resultCount.count);
		resp.totalPages = Math.ceil(resp.count / resp.perPage);

		const orderByCondition: SQL[] = [];
		if (orderBy?.trim()) {
			if (orderBy === 'price') {
				orderByCondition.push(asc(product.price));
			}

			if (orderBy === 'average_rating') {
				orderByCondition.push(desc(product.averageRating));
			}
		}

		const resultProductRows = this.db
			.select({
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				inStock: product.inStock,
				averageRating: product.averageRating,
				reviews: product.reviews
			})
			.from(product)
			.leftJoin(image, eq(product.id, image.productId))
			.leftJoin(size, eq(product.id, size.productId))
			.leftJoin(color, eq(product.id, color.productId))
			.leftJoin(productCategory, eq(product.id, productCategory.productId))
			.leftJoin(category, eq(productCategory.categoryId, category.id))
			.where(conditions.length ? and(...conditions) : undefined)
			.groupBy(product.id)
			.orderBy(...orderByCondition)
			.limit(resp.perPage)
			.offset((resp.page - 1) * resp.perPage)
			.all();

		const productsIds = resultProductRows.map((p) => p.id);

		const resultImageRows = this.db
			.select({
				url: image.url,
				productId: image.productId
			})
			.from(image)
			.where(inArray(image.productId, productsIds))
			.all();

		const resultCategoryRows = this.db
			.select({
				id: category.id,
				name: category.name,
				productId: productCategory.productId
			})
			.from(category)
			.innerJoin(productCategory, eq(category.id, productCategory.categoryId))
			.where(inArray(productCategory.productId, productsIds))
			.all();

		const products: Omit<Product, 'colors' | 'sizes'>[] = [];

		for (const row of resultProductRows) {
			products.push({
				id: row.id,
				name: row.name,
				description: row.description,
				price: Number(row.price),
				inStock: row.inStock,
				averageRating: row.averageRating,
				reviews: row.reviews,
				category: resultCategoryRows.filter((c) => c.productId === row.id),
				images: resultImageRows
					.filter((i) => i.productId === row.id)
					.map(({ url }) => url)
			});
		}

		resp.items = products;
		return resp;
	}
}

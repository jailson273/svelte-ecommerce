import { type DbContext } from '$lib/server/db';
import {
	color,
	image,
	order,
	orderItem,
	product,
	size
} from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { and, eq } from 'drizzle-orm';
import type { UpdateAmountOrderUseCase } from './UpdateAmountOrderUseCase';

export interface AddItemOnOrderParams {
	orderId: number;
	productId: number;
	sizeId: number;
	colorId: number;
	quantity: number;
}

export class AddItemOrderUseCase {
	constructor(
		private readonly db: DbContext,
		private readonly updateAmountOrder: UpdateAmountOrderUseCase
	) {}

	async execute({
		orderId,
		productId,
		colorId,
		sizeId,
		quantity
	}: AddItemOnOrderParams): Promise<ReturnAsync<{ id: number }, string>> {
		const _order = this.db
			.select({
				id: order.id,
				total: order.total,
				tax: order.tax,
				discount: order.discount,
				subtotal: order.subtotal
			})
			.from(order)
			.where(eq(order.id, orderId))
			.limit(1)
			.get();
		if (!_order) return [null, 'Order nor found'];

		const _orderItem = this.db
			.select({
				id: orderItem.id,
				quantity: orderItem.quantity,
				price: orderItem.price,
				orderId: orderItem.orderId
			})
			.from(orderItem)
			.where(
				and(
					eq(orderItem.productId, productId),
					eq(orderItem.orderId, orderId),
					eq(orderItem.sizeId, sizeId),
					eq(orderItem.colorId, colorId)
				)
			)
			.limit(1)
			.get();

		if (_orderItem) {
			const newQuantity = _orderItem.quantity + quantity;
			this.db
				.update(orderItem)
				.set({ quantity: newQuantity })
				.where(eq(orderItem.id, _orderItem.id))
				.execute();

			await this.updateAmountOrder.execute(orderId);

			return [{ id: _orderItem.id }, null];
		}

		const _size = this.db
			.select({ id: size.id, name: size.name })
			.from(size)
			.where(and(eq(size.id, sizeId), eq(size.productId, productId)))
			.limit(1)
			.get();
		if (!_size) {
			return [null, 'Size not found'];
		}

		const _color = this.db
			.select({
				id: color.id,
				name: color.name,
				hexadecimal: color.hexadecimal
			})
			.from(color)
			.where(and(eq(color.id, colorId), eq(color.productId, productId)))
			.limit(1)
			.get();
		if (!_color) {
			return [null, 'Color not found'];
		}

		const _product = this.db
			.select()
			.from(product)
			.where(eq(product.id, productId))
			.limit(1)
			.get();
		if (!_product) {
			return [null, 'Product not found'];
		}

		if (_product.inStock < quantity) {
			return [null, 'Not enough stock'];
		}

		const _image = this.db
			.select({ url: image.url })
			.from(image)
			.where(eq(image.productId, productId))
			.limit(1)
			.get();

		const created = this.db
			.insert(orderItem)
			.values({
				productName: _product.name,
				orderId,
				productId,
				sizeId,
				colorId,
				quantity,
				sizeName: _size.name,
				colorName: _color.name,
				colorHexadecimal: _color.hexadecimal,
				imageUrl: _image?.url || '',
				price: _product.price
			})
			.returning({ id: orderItem.id, orderId: orderItem.orderId })
			.get();

		await this.updateAmountOrder.execute(orderId);

		return [created, null];
	}
}

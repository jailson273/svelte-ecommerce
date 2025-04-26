import { sqliteTable, integer, text, numeric } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	clerkId: text('clerk_id').notNull()
});

export const address = sqliteTable('address', {
	id: integer('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	zipCode: text('zip_code').notNull(),
	street: text('street').notNull(),
	district: text('district').notNull(),
	city: text('city').notNull(),
	state: text('city').notNull(),
	country: text('country').notNull(),
	number: text('number').notNull(),
	complement: text('complement')
});

export const product = sqliteTable('product', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	price: numeric('price').notNull(),
	inStock: integer('in_stock').notNull(),
	reviews: integer('reviews'),
	averageRating: numeric('average_rating')
});

export const color = sqliteTable('color', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	hexadecimal: text('hexadecimal').notNull(),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' })
});

export const size = sqliteTable('size', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' })
});

export const image = sqliteTable('image', {
	id: integer('id').primaryKey(),
	url: text('value').notNull(),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' })
});

export const category = sqliteTable('category', {
	id: integer('id').primaryKey(),
	name: text('name').notNull()
});

export const productCategory = sqliteTable('product_category', {
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	categoryId: integer('category_id')
		.notNull()
		.references(() => category.id, { onDelete: 'cascade' })
});

export const review = sqliteTable('review', {
	id: integer('id').primaryKey(),
	description: text('description').notNull(),
	rating: integer('rating').notNull(),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	date: text('date').notNull()
});

export const newsletter = sqliteTable('newsletter', {
	id: integer('id').primaryKey(),
	email: text('email').notNull(),
	createdAt: text('created_at').notNull()
});

export const coupon = sqliteTable('coupon', {
	id: integer('id').primaryKey(),
	code: text('code').notNull(),
	discount: numeric('discount').notNull()
});

export const wishlist = sqliteTable('wishlist', {
	id: integer('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	date: text('date').notNull()
});

export const order = sqliteTable('order', {
	id: integer('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	couponCode: text('coupon_code'),
	startDate: text('start_date').notNull(),
	status: text('status').notNull(),
	placedOrderDate: text('placed_order_date'),
	discount: numeric('discount').notNull(),
	tax: numeric('tax').notNull(),
	total: numeric('total').notNull(),
	subtotal: numeric('subtotal').notNull(),
	zipCode: text('zip_code'),
	street: text('street'),
	district: text('district'),
	city: text('city'),
	state: text('city'),
	country: text('country'),
	number: text('number'),
	complement: text('complement')
});

export const orderItem = sqliteTable('order_item', {
	id: integer('id').primaryKey(),
	orderId: integer('order_id')
		.notNull()
		.references(() => order.id, { onDelete: 'cascade' }),
	productId: integer('product_id')
		.notNull()
		.references(() => product.id, { onDelete: 'cascade' }),
	productName: text('product_name').notNull(),
	sizeId: integer('size_id').references(() => size.id, { onDelete: 'cascade' }),
	sizeName: text('size_name').notNull(),
	colorId: integer('color_id').references(() => color.id, {
		onDelete: 'cascade'
	}),
	colorName: text('color_name').notNull(),
	colorHexadecimal: text('color_hexadecimal').notNull(),
	imageUrl: text('image_url').notNull(),
	quantity: integer('quantity').notNull(),
	price: numeric('price').notNull()
});

import { OrderStatus } from '$lib/models/OrderStatus';
import { type DbContext } from '$lib/server/db';
import { user, order, address } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq, and } from 'drizzle-orm';

export class CreateDraftOrderUseCase {
	constructor(private readonly db: DbContext) {}

	async execute(userId: number): Promise<ReturnAsync<{ id: number }, string>> {
		const _order = this.db
			.select({ id: order.id })
			.from(order)
			.where(and(eq(order.userId, userId), eq(order.status, OrderStatus.draft)))
			.limit(1)
			.get();

		if (_order) return [_order, null];

		const _user = this.db
			.select({ id: user.id })
			.from(user)
			.where(eq(user.id, userId))
			.limit(1)
			.get();

		if (!_user) return [null, 'User not found'];

		const _address = this.db
			.select()
			.from(address)
			.where(eq(address.userId, userId))
			.limit(1)
			.get();

		const resp = await fetch(
			`https://viacep.com.br/ws/${_address?.zipCode}/json/`
		);
		const data = await resp.json();

		const created = this.db
			.insert(order)
			.values({
				userId,
				startDate: new Date().toISOString(),
				status: OrderStatus.draft,
				discount: String(0),
				tax: data?.erro ? String(0) : String(data?.siafi / 100),
				total: String(0),
				subtotal: String(0),
				placedOrderDate: null,
				couponCode: null,
				zipCode: _address?.zipCode || '',
				street: _address?.street || '',
				district: _address?.district || '',
				city: _address?.city || '',
				state: _address?.state || '',
				country: _address?.country || '',
				number: _address?.number || '',
				complement: _address?.complement || ''
			})
			.returning({ id: order.id })
			.get();

		return [created, null];
	}
}

import type { DbContext } from '$lib/server/db';
import { AddItemOrderUseCase } from './useCase/AddItemOrderUseCase';
import { CreateDraftOrderUseCase } from './useCase/CreateDraftOrderUseCase';
import { GetDraftOrderByUserIdUseCase } from './useCase/GetDraftOrderByUserIdUseCase';
import { GetItemsByOrderIdUseCase } from './useCase/GetItemsByOrderIdUseCase';
import { RemoveItemOrderUseCase } from './useCase/RemoveItemOrderUseCase';
import { UpdateItemUseCase } from './useCase/UpdateItemUseCase';
import { UpdateAmountOrderUseCase } from './useCase/UpdateAmountOrderUseCase';
import { UpdateCouponUseCase } from './useCase/UpdateCouponUseCase';
import { UpdateOrderAddressUseCase } from './useCase/UpdateOrderAddressUseCase';
import { PlaceOrderUseCase } from './useCase/PlaceOrderUseCase';
import { GetOrderByIdUseCase } from './useCase/GetOrderByIdUseCase';
import { GetAllOrdersUseCase } from './useCase/GetAllOrdersUseCase';

export class OrderService {
	addItemOrder: AddItemOrderUseCase;
	createDraftOrder: CreateDraftOrderUseCase;
	getDraftOrderByUserId: GetDraftOrderByUserIdUseCase;
	getItemsByOrderId: GetItemsByOrderIdUseCase;
	removeItemOrder: RemoveItemOrderUseCase;
	updateItem: UpdateItemUseCase;
	updateAmountOrder: UpdateAmountOrderUseCase;
	updateCoupon: UpdateCouponUseCase;
	updateOrderAddress: UpdateOrderAddressUseCase;
	placeOrder: PlaceOrderUseCase;
	getOrderById: GetOrderByIdUseCase;
	getAllOrders: GetAllOrdersUseCase;

	constructor(private readonly db: DbContext) {
		this.updateAmountOrder = new UpdateAmountOrderUseCase(this.db);
		this.addItemOrder = new AddItemOrderUseCase(
			this.db,
			this.updateAmountOrder
		);
		this.createDraftOrder = new CreateDraftOrderUseCase(this.db);
		this.getDraftOrderByUserId = new GetDraftOrderByUserIdUseCase(this.db);
		this.getItemsByOrderId = new GetItemsByOrderIdUseCase(this.db);
		this.removeItemOrder = new RemoveItemOrderUseCase(
			this.db,
			this.updateAmountOrder
		);
		this.updateItem = new UpdateItemUseCase(this.db, this.updateAmountOrder);
		this.updateCoupon = new UpdateCouponUseCase(
			this.db,
			this.updateAmountOrder
		);
		this.updateOrderAddress = new UpdateOrderAddressUseCase(
			this.db,
			this.updateAmountOrder
		);
		this.placeOrder = new PlaceOrderUseCase(this.db);
		this.getOrderById = new GetOrderByIdUseCase(this.db);
		this.getAllOrders = new GetAllOrdersUseCase(this.db);
	}
}

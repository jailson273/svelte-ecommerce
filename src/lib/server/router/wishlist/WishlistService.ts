import type { DbContext } from '$lib/server/db';
import { CreateWishlistUseCase } from './useCase/CreateWishlistUseCase';
import { DeleteWishlistUseCase } from './useCase/DeleteWishlistUseCase';
import { GetAllByUserIdUseCase } from './useCase/GetAllByUserIdUseCase';
import { GetByUserIdAndProductIdUseCase } from './useCase/GetByUserIdAndProductIdUseCase';

export class Wishlistervive {
	createWishlist: CreateWishlistUseCase;
	deleteWishlist: DeleteWishlistUseCase;
	getByUserIdAndProductId: GetByUserIdAndProductIdUseCase;
	getAllByUserId: GetAllByUserIdUseCase;

	constructor(private readonly db: DbContext) {
		this.createWishlist = new CreateWishlistUseCase(this.db);
		this.deleteWishlist = new DeleteWishlistUseCase(this.db);
		this.getByUserIdAndProductId = new GetByUserIdAndProductIdUseCase(this.db);
		this.getAllByUserId = new GetAllByUserIdUseCase(this.db);
	}
}

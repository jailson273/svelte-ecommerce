import type { DbContext } from '$lib/server/db';
import { CreateUserUseCase } from './useCase/CreateUserUseCase';
import { GetAddessByUserIdUseCase } from './useCase/GetAddessByUserIdUseCase';
import { GetUserByClerkIdUseCase } from './useCase/GetUserByClerkIdUseCase';
import { UpdateAddressUseCase } from './useCase/UpdateAddressUseCase';

export class UserServive {
	createUser: CreateUserUseCase;
	getUserByClerkId: GetUserByClerkIdUseCase;
	getAddessByUserId: GetAddessByUserIdUseCase;
	updateAddress: UpdateAddressUseCase;

	constructor(private readonly db: DbContext) {
		this.createUser = new CreateUserUseCase(this.db);
		this.getUserByClerkId = new GetUserByClerkIdUseCase(this.db);
		this.getAddessByUserId = new GetAddessByUserIdUseCase(this.db);
		this.updateAddress = new UpdateAddressUseCase(this.db);
	}
}

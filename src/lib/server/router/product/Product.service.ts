import type { DbContext } from '$lib/server/db';
import { GetDistinctCategoryUseCase } from './userCase/GetDistinctCategoryUseCase';
import { GetDistinctColorUseCase } from './userCase/GetDistinctColorUseCase';
import { GetDistinctSizeUseCase } from './userCase/GetDistinctSizeUseCase';
import { GetListProductUseCase } from './userCase/GetListProductUseCase';
import { GetMinMaxPriceUseCase } from './userCase/GetMinMaxPriceUseCase';
import { GetProductByIdUseCase } from './userCase/GetProductByIdUseCase';
import { GetReviewByProductIdUseCase } from './userCase/GetReviewByProductIdUseCase';

export class ProductServive {
	getDistinctCategory: GetDistinctCategoryUseCase;
	getDistinctColor: GetDistinctColorUseCase;
	getDistinctSize: GetDistinctSizeUseCase;
	getListProduct: GetListProductUseCase;
	getMinMaxPrice: GetMinMaxPriceUseCase;
	getProductById: GetProductByIdUseCase;
	getReviewByProductId: GetReviewByProductIdUseCase;

	constructor(private readonly db: DbContext) {
		this.getDistinctCategory = new GetDistinctCategoryUseCase(this.db);
		this.getDistinctColor = new GetDistinctColorUseCase(this.db);
		this.getDistinctSize = new GetDistinctSizeUseCase(this.db);
		this.getListProduct = new GetListProductUseCase(this.db);
		this.getMinMaxPrice = new GetMinMaxPriceUseCase(this.db);
		this.getProductById = new GetProductByIdUseCase(this.db);
		this.getReviewByProductId = new GetReviewByProductIdUseCase(this.db);
	}
}

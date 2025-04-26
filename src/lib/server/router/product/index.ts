import { db } from '$lib/server/db';
import { ProductServive } from './Product.service';

export const productService = new ProductServive(db);

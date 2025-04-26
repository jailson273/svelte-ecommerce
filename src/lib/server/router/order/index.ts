import { db } from '$lib/server/db';
import { OrderService } from './OrderService';

export const orderService = new OrderService(db);

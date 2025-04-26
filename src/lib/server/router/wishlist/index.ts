import { db } from '$lib/server/db';
import { Wishlistervive } from './WishlistService';

export const wishlistService = new Wishlistervive(db);

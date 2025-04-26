import type { Color } from './Color';
import type { Size } from './Size';

export interface CartItem {
	id: string;
	productId: number;
	quantity: number;
	price: number;
	name: string;
	image: string;
	color: Color;
	size: Size;
}

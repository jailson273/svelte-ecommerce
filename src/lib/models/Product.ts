import type { Category } from './Category';
import type { Color } from './Color';
import type { Size } from './Size';

export interface Product {
	id: number;
	name: string;
	category: Category[];
	description: string;
	price: number;
	images: string[];
	sizes: Size[];
	colors: Color[];
	inStock: number;
	reviews: number | null;
	averageRating: string | null;
}

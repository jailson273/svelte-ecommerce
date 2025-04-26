export interface OrderItem {
	id: number;
	orderId: number;
	productId: number;
	productName: string;
	sizeId: number | null;
	sizeName: string;
	colorId: number | null;
	colorName: string;
	colorHexadecimal: string;
	imageUrl: string;
	quantity: number;
	price: string;
}

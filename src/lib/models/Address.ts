export interface Address {
	zipCode: string;
	street: string;
	district: string;
	city: string;
	state: string;
	number: string;
	country: string;
	complement?: string | null;
}

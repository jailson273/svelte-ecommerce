export interface List<T> {
	page: number;
	perPage: number;
	count: number;
	totalPages: number;
	items: T[];
}

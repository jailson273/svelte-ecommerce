export interface Filter {
	key: string;
	label: string;
	options: Option[];
}

export interface Option {
	name: string;
	value: string;
}

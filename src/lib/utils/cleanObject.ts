const isNullUndefinedEmpty = (value: any): boolean => {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string' && value.trim() === '') return true;
	if (Array.isArray(value) && value.length === 0) return true;
	if (typeof value === 'object' && Object.keys(value).length === 0) return true;
	return false;
};

export function cleanObject<T extends object>(obj: T): Partial<T> {
	return Object.keys(obj).reduce((acc, key) => {
		if (isNullUndefinedEmpty(obj[key])) {
			return acc;
		}
		acc[key] = obj[key];
		return acc;
	}, {} as Partial<T>);
}

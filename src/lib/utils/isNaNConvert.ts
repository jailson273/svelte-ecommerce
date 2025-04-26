export const isNaNConvert = (value: any, fallback = 0): number => {
	return isNaN(Number(value)) ? fallback : Number(value);
};

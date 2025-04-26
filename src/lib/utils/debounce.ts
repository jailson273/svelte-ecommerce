type DebounceFunction = (...args: any[]) => void;

export function debounce(
	func: DebounceFunction,
	delay: number
): DebounceFunction {
	let timeoutId: NodeJS.Timeout;
	return function (this: unknown, ...args: any[]) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
}

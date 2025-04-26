export function getInitials(name: string) {
	const words = name.split(' ');
	return words[0][0] + words[words.length - 1][0];
}

export const convertDate = (date: string) => {
	const inputDate = new Date(date);
	const formattedDate = inputDate.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	});
	return `Ordered on: ${formattedDate}`;
};

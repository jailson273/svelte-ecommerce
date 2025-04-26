import { shop } from '../shop.store';

export function urlFilteredUpdate(url: string) {
	shop.update((prev) => {
		prev.urlFiltered = url;
		return prev;
	});
}

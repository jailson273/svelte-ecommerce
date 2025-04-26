import type { Unsubscriber } from 'svelte/store';
import { shop } from '../shop.store';

export function urlFilteredSubscribe(callback: (urlFiltered: string) => void): Unsubscriber {
	return shop.subscribe((prev) => {
		callback(prev.urlFiltered);
	});
}

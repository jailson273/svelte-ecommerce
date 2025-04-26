import { writable } from 'svelte/store';

export const shop = writable<{ urlFiltered: string }>({
	urlFiltered: '/shop'
});

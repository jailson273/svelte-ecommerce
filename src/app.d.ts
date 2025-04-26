// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '$env/static/public' {
	export const PUBLIC_CLERK_PUBLISHABLE_KEY: string;
}

declare global {
	interface Fetch {
		(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
	}

	interface Window {
		fetch: Fetch;
	}
}

export {};

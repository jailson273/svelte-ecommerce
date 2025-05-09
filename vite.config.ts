import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		server: {
			host: '0.0.0.0',
			port: 5173,
			allowedHosts: ['srv704157.hstgr.cloud']
		},
		watch: {
			ignored: ['./db.json']
		}
	}
});

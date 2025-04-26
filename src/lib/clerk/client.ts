// src/lib/clerk.js
// Inicialização e configuração do Clerk

import { writable, derived, get } from 'svelte/store';
import type {
	UserResource,
	SignedInSessionResource,
	SignInCreateParams,
	SignUpCreateParams,
	SetActiveParams,
	SignOutOptions
} from '@clerk/types';
import * as _ from '@clerk/clerk-js';
import { loadOrder } from '$lib/store/cart/cart.store';
const { Clerk } = _;

// Crie stores para manter o estado do Clerk
export const userId = writable<number | null>(null);
export const clerk = writable<_.Clerk | null>(null);
export const isLoaded = writable(false);
export const isLoadingClerk = writable(false);
export const user = writable<UserResource | null>(null);
export const session = writable<SignedInSessionResource | null>(null);
export const isSignedIn = derived(user, ($user) => !!$user);

async function handleGetUserId(clerkId: string) {
	const resp = await fetch(`/api/user/getByClekId/${clerkId}`);
	if (resp.ok) {
		const { user } = await resp.json();
		if (user) userId.set(user.id);
	}
}

// Função para inicializar o Clerk
export async function initClerk(publishableKey: string) {
	try {
		isLoadingClerk.set(true);
		const _clerk = new Clerk(publishableKey);
		await _clerk.load();

		clerk.set(_clerk);
		isLoaded.set(true);

		// Atualizar user e session
		if (_clerk.user) {
			user.set(_clerk.user);
		}

		if (_clerk.session) {
			session.set(_clerk.session);
		}

		// Configurar listeners para mudanças de estado
		_clerk.addListener(({ user: clerkUser, session: clerkSession }) => {
			user.set(clerkUser || null);
			session.set(clerkSession || null);
			handleGetUserId(clerkUser?.id || '');
			loadOrder();
		});

		isLoadingClerk.set(false);

		return _clerk;
	} catch (error) {
		isLoadingClerk.set(false);
		console.error('Error on initializer Clerk:', error);
		throw error;
	}
}

// Funções de autenticação
export async function signIn(params: SignInCreateParams) {
	const _clerk = get(clerk);
	if (!_clerk) throw new Error('Clerk não inicializado');
	return await _clerk.client!.signIn.create(params);
}

export async function signUp(params: SignUpCreateParams) {
	const _clerk = get(clerk);
	if (!_clerk) throw new Error('Clerk não inicializado');
	return await _clerk.client!.signUp.create(params);
}

export async function signOut(options?: SignOutOptions) {
	const _clerk = get(clerk);
	if (!_clerk) throw new Error('Clerk não inicializado');
	return await _clerk.signOut(options);
}

export async function getToken() {
	const _clerk = get(clerk);
	if (!_clerk || !_clerk.session) return null;
	return await _clerk.session.getToken();
}

export async function setActive(params: SetActiveParams) {
	const _clerk = get(clerk);
	if (!_clerk) throw new Error('Clerk não inicializado');
	return await _clerk.setActive(params);
}

export async function signUpWithGoogle(callback?: () => void) {
	const _clerk = get(clerk);
	if (!_clerk) throw new Error('Clerk não inicializado');

	_clerk.client?.signUp
		.authenticateWithRedirect({
			strategy: 'oauth_google',
			redirectUrl: '/auth/signup/register',
			redirectUrlComplete: '/auth/signup/register'
		})
		.finally(() => callback?.());
}

export async function signInWithGoogle(callback?: () => void) {
	const _clerk = get(clerk);
	if (!_clerk) throw new Error('Clerk não inicializado');

	_clerk.client?.signIn
		.authenticateWithRedirect({
			strategy: 'oauth_google',
			redirectUrl: '/auth/login/complete',
			redirectUrlComplete: '/auth/login/complete'
		})
		.finally(() => callback?.());
}

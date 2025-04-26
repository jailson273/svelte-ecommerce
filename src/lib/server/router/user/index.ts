import { db } from '$lib/server/db';
import { UserServive } from './UserService';

export const userService = new UserServive(db);

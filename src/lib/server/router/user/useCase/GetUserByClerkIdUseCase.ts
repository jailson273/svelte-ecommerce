import type { User } from '$lib/models/User';
import type { DbContext } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';



export class GetUserByClerkIdUseCase {
  constructor(private readonly db: DbContext) {}
  async execute(clerkId: string): ReturnAsync<User, string> {
    try {
    const _user = this.db
      .select()
      .from(user)
      .where(eq(user.clerkId, clerkId))
      .get();
      if(!_user) return [null, 'User not found'];
      return [_user, null];
    } catch {
      return [null, 'Error creating user'];
    }
  }
}

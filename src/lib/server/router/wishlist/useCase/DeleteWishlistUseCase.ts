import type { DbContext } from '$lib/server/db';
import { wishlist } from '$lib/server/db/schema';
import type { ReturnAsync } from '$lib/utils/ServiceReturn';
import { eq } from 'drizzle-orm';


export class DeleteWishlistUseCase {
  constructor(private readonly db: DbContext) {}

  async execute(id: number): ReturnAsync<boolean, string> {
        try {
      this.db.delete(wishlist).where(eq(wishlist.id, id)).execute();

      return [true, null];
    } catch {
      return [null, 'Error creating user'];
    }
  }
}

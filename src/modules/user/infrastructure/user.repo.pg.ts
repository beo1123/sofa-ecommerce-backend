import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { users } from '../../../shared/db/schema.js';
import { UserRepository } from '../domain/user.repository.js';
import { User } from '../domain/user.entity.js';

export class PgUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        displayName: users.displayName,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!rows.length) return null;
    const r = rows[0];
    return new User(r.id, r.email, r.password, r.displayName);
  }
  async findByEmail(email: string): Promise<User | null> {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!rows.length) return null;
    const r = rows[0];
    return new User(r.id, r.email, r.password);
  }
  async create(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      password: user.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateProfile(
    id: string,
    data: { username?: string; displayName?: string },
  ): Promise<void> {
    await db
      .update(users)
      .set({
        username: data.username,
        displayName: data.displayName,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({
        password: passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }
}

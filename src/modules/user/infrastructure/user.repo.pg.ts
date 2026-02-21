import { eq, and } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { users, userRoles, roles } from '../../../shared/db/schema.js';
import { UserRepository } from '../domain/user.repository.js';
import { User } from '../domain/user.entity.js';

export class PgUserRepository implements UserRepository {
  /**
   * Find user by ID with all roles in single query
   */
  async findById(id: string): Promise<User | null> {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        displayName: users.displayName,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.userId, users.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(users.id, id));

    if (!rows.length) return null;

    const r = rows[0];
    const userRoleList = [
      ...new Set(
        rows
          .map((row) => row.roleName)
          .filter((name): name is string => name !== null && name !== undefined),
      ),
    ];

    return new User(
      r.id,
      r.email,
      r.password,
      r.displayName,
      r.username,
      r.createdAt,
      r.updatedAt,
      r.lastLogin,
      userRoleList,
    );
  }

  /**
   * Find user by email with all roles in single query
   */
  async findByEmail(email: string): Promise<User | null> {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        displayName: users.displayName,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.userId, users.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(users.email, email));

    if (!rows.length) return null;

    const r = rows[0];
    const userRoleList = [
      ...new Set(
        rows
          .map((row) => row.roleName)
          .filter((name): name is string => name !== null && name !== undefined),
      ),
    ];

    return new User(
      r.id,
      r.email,
      r.password,
      r.displayName,
      r.username,
      r.createdAt,
      r.updatedAt,
      r.lastLogin,
      userRoleList,
    );
  }

  /**
   * Create new user
   */
  async create(user: User): Promise<void> {
    await db.insert(users).values({
      id: user.id,
      email: user.email,
      password: user.passwordHash,
      displayName: user.displayName,
      username: user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    id: string,
    data: { username?: string; displayName?: string },
  ): Promise<void> {
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (data.username !== undefined) {
      updateData.username = data.username;
    }

    if (data.displayName !== undefined) {
      updateData.displayName = data.displayName;
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await db
      .update(users)
      .set({
        password: passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({
        lastLogin: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  }

  /**
   * Assign role to user (idempotent)
   */
  async assignRole(userId: string, roleId: string): Promise<void> {
    await db
      .insert(userRoles)
      .values({
        userId,
        roleId,
      })
      .onConflictDoNothing();
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleId: string): Promise<void> {
    await db
      .delete(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
  }

  /**
   * Get user roles efficiently
   */
  async getUserRoles(userId: string): Promise<string[]> {
    const rows = await db
      .select({
        name: roles.name,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, userId));

    return rows.map((r) => r.name);
  }

  /**
   * Find all users with roles in optimized query
   */
  async findAll(): Promise<User[]> {
    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        password: users.password,
        displayName: users.displayName,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
        roleName: roles.name,
      })
      .from(users)
      .leftJoin(userRoles, eq(userRoles.userId, users.id))
      .leftJoin(roles, eq(roles.id, userRoles.roleId));

    // Group by user id
    const userMap = new Map<string, User>();

    for (const row of rows) {
      if (!userMap.has(row.id)) {
        userMap.set(
          row.id,
          new User(
            row.id,
            row.email,
            row.password,
            row.displayName,
            row.username,
            row.createdAt,
            row.updatedAt,
            row.lastLogin,
            [],
          ),
        );
      }

      const user = userMap.get(row.id)!;
      if (row.roleName) {
        user.roles.push(row.roleName);
      }
    }

    return Array.from(userMap.values());
  }

  /**
   * Check if user has specific role
   */
  async hasRole(userId: string, roleName: string): Promise<boolean> {
    const rows = await db
      .select({ id: userRoles.id })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(and(eq(userRoles.userId, userId), eq(roles.name, roleName)))
      .limit(1);

    return rows.length > 0;
  }

  /**
   * Get user count (useful for admin dashboard)
   */
  async getUserCount(): Promise<number> {
    const result = await db.select({ count: users.id }).from(users);
    return result.length;
  }
}

import { eq } from 'drizzle-orm';
import { db } from '../../../shared/db/pg.js';
import { roles } from '../../../shared/db/schema.js';
import { RoleRepository } from '../domain/role.repository.js';
import { Role } from '../domain/role.entity.js';

export class PgRoleRepository implements RoleRepository {
  async findById(id: string): Promise<Role | null> {
    const rows = await db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.id, id))
      .limit(1);

    if (!rows.length) return null;
    const r = rows[0];
    return new Role(r.id, r.name);
  }

  async findByName(name: string): Promise<Role | null> {
    const rows = await db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1);

    if (!rows.length) return null;
    const r = rows[0];
    return new Role(r.id, r.name);
  }

  async create(role: Role): Promise<void> {
    await db.insert(roles).values({
      id: role.id,
      name: role.name,
    });
  }

  async findAll(): Promise<Role[]> {
    const rows = await db
      .select({
        id: roles.id,
        name: roles.name,
      })
      .from(roles);

    return rows.map((r) => new Role(r.id, r.name));
  }

  async update(role: Role): Promise<void> {
    await db.update(roles).set({ name: role.name }).where(eq(roles.id, role.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(roles).where(eq(roles.id, id));
  }
}

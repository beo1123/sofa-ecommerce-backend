import { Role } from './role.entity.js';

export interface RoleRepository {
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  create(role: Role): Promise<void>;
  findAll(): Promise<Role[]>;
}

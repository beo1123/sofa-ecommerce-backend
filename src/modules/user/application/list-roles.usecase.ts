import { RoleRepository } from '../domain/role.repository.js';

export class ListRolesUseCase {
  constructor(private readonly roleRepo: RoleRepository) {}

  async execute(): Promise<Array<{ id: string; name: string }>> {
    const roles = await this.roleRepo.findAll();
    return roles.map((role) => ({
      id: role.id,
      name: role.name,
    }));
  }
}

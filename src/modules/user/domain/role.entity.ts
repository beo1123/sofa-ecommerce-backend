export class Role {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  static create(data: { id: string; name: string }): Role {
    return new Role(data.id, data.name);
  }
}

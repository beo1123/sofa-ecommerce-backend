export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string | null,
    public readonly displayName?: string | null,
    public readonly username?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly lastLogin?: Date | null,
    public readonly roles: string[] = [],
  ) {}

  /**
   * Helper method to create a new User
   */
  static create(data: {
    id: string;
    email: string;
    passwordHash: string | null;
    displayName?: string | null;
    username?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date | null;
    roles?: string[];
  }): User {
    return new User(
      data.id,
      data.email,
      data.passwordHash,
      data.displayName,
      data.username,
      data.createdAt,
      data.updatedAt,
      data.lastLogin,
      data.roles || [],
    );
  }
}

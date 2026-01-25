export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string | null,
    public readonly displayName?: string | null,
    public readonly createdAt?: Date,
  ) {}

  /**
   * Một helper method để tạo User mới mà không cần ID (nếu dùng UUID tự động)
   * Hoặc bạn có thể giữ nguyên constructor nếu bạn muốn tạo ID ở tầng Application.
   */
  static create(data: {
    id: string;
    email: string;
    passwordHash: string | null;
    displayName?: string | null;
  }): User {
    return new User(data.id, data.email, data.passwordHash, data.displayName);
  }
}

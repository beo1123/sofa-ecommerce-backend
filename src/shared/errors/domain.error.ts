export class DomainError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    // Đảm bảo prototype được thiết lập đúng cho các bản Node/TS mới
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

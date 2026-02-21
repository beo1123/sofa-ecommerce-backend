export class ProductImage {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly alt: string | null,
    public readonly isPrimary: boolean,
  ) {}
}

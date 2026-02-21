export class ProductVariant {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly skuPrefix: string | null,
    public readonly colorCode: string | null,
    public readonly colorName: string | null,
    public readonly material: string | null,
    public readonly price: number,
    public readonly compareAtPrice: number | null,
    public readonly image: string | null,
    public readonly stock: {
      quantity: number;
      reserved: number;
    },
  ) {}
}

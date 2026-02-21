import { ProductImage } from './product-image.entity.js';
import { ProductVariant } from './product-variant.entity.js';

export class Product {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly slug: string,
    public readonly status: string,
    public readonly images: ProductImage[],
    public readonly variants: ProductVariant[],
  ) {}
}

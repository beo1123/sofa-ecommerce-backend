/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConflictError } from '../../../shared/errors/conflict.error.js';
import { NotFoundError } from '../../../shared/errors/not-found.error.js';
import { ProductRepository } from '../../product/domain/product.repository.js';

export class DeleteProductStatusUseCase {
  constructor(private readonly repo: ProductRepository) {}

  async execute(name: string): Promise<void> {
    const normalizedName = name?.trim();
    if (!normalizedName) throw new NotFoundError('Product status');

    const statuses = await this.repo.listStatuses();
    const exists = statuses.some((status) => status.name === normalizedName);
    if (!exists) throw new NotFoundError('Product status');

    try {
      await this.repo.deleteStatus(normalizedName);
    } catch (error: any) {
      if (error?.code === '23503') {
        throw new ConflictError('Không thể xoá status đang được sản phẩm sử dụng');
      }
      throw error;
    }
  }
}

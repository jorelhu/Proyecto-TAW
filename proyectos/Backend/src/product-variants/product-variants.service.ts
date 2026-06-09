import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private variantsRepository: Repository<ProductVariant>,
  ) {}

  async findAll(): Promise<ProductVariant[]> {
    return await this.variantsRepository.find();
  }

  async findOne(id: number): Promise<ProductVariant> {
    const variant = await this.variantsRepository.findOneBy({ id });
    if (!variant) {
      throw new NotFoundException(`Variante con ID ${id} no encontrada`);
    }
    return variant;
  }

  async findByProduct(productId: number): Promise<ProductVariant[]> {
    return await this.variantsRepository.find({
      where: { productId },
    });
  }

  async create(data: Partial<ProductVariant>): Promise<ProductVariant> {
    const variant = this.variantsRepository.create(data);
    return await this.variantsRepository.save(variant);
  }

  async update(
    id: number,
    data: Partial<ProductVariant>,
  ): Promise<ProductVariant> {
    await this.variantsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.variantsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Variante con ID ${id} no encontrada`);
    }
  }
}

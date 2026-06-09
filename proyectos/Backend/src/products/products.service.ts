// products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      // CAMBIO AQUÍ: Usamos un objeto en lugar de un array de strings
      relations: {
        images: true,
        variants: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      // CAMBIO AQUÍ TAMBIÉN
      relations: {
        images: true,
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return product;
  }

  async create(productData: any): Promise<Product> {
    // 1. Crea la instancia en memoria
    const newProduct = this.productsRepository.create(productData);
    // 2. Guardamos y hacemos el doble cast seguro: de un supuesto array a unknown, y de ahí a Product
    const savedProduct = await this.productsRepository.save(newProduct);
    return savedProduct as unknown as Product;
  }

  async update(id: number, data: Partial<Product>): Promise<Product> {
    await this.productsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}

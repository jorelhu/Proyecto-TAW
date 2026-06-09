import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
  ) {}

  async findAll(): Promise<ProductImage[]> {
    return await this.imagesRepository.find();
  }

  async findOne(id: number): Promise<ProductImage> {
    const image = await this.imagesRepository.findOneBy({ id });
    if (!image) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }
    return image;
  }

  async findByProduct(productId: number): Promise<ProductImage[]> {
    return await this.imagesRepository.find({
      where: { productId },
    });
  }

  async findPrimary(productId: number): Promise<ProductImage | null> {
    return await this.imagesRepository.findOne({
      where: { productId, isPrimary: true },
    });
  }

  async create(data: Partial<ProductImage>): Promise<ProductImage> {
    // Si es la primera imagen del producto o se marca como principal
    if (data.isPrimary) {
      // Quitar la marca principal de otras imágenes del mismo producto
      if (data.productId) {
        await this.imagesRepository.update(
          { productId: data.productId, isPrimary: true },
          { isPrimary: false },
        );
      }
    }
    const image = this.imagesRepository.create(data);
    return await this.imagesRepository.save(image);
  }

  async update(id: number, data: Partial<ProductImage>): Promise<ProductImage> {
    // Si se está marcando como principal
    if (data.isPrimary) {
      const image = await this.findOne(id);
      if (image.productId) {
        await this.imagesRepository.update(
          { productId: image.productId, isPrimary: true },
          { isPrimary: false },
        );
      }
    }
    await this.imagesRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.imagesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Imagen con ID ${id} no encontrada`);
    }
  }
}

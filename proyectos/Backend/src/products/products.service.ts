/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
// Importamos el servicio de imágenes
import { ProductImagesService } from '../product-images/product-images.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    // Inyectamos el servicio para poder guardar las imágenes nuevas
    private productImagesService: ProductImagesService,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: {
        images: true,
        variants: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
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
    const newProduct = this.productsRepository.create(productData);
    const savedProduct = await this.productsRepository.save(newProduct);
    return savedProduct as unknown as Product;
  }

  async update(
    id: number,
    updateProductDto: any,
    files?: Express.Multer.File[],
  ): Promise<Product> {
    // 1. Extraemos los campos relacionales o extraños para no romper la tabla 'product'
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { variants, primaryImageIndex, ...productCoreData } =
      updateProductDto;

    // 2. Actualizamos solo los datos básicos del producto
    await this.productsRepository.update(id, productCoreData);

    // 3. Si vienen archivos nuevos desde el frontend, los procesamos y vinculamos
    if (files && files.length > 0) {
      const primaryIdx = parseInt(primaryImageIndex, 10);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Al usar el interceptor, file.filename ya existe y evitamos el 'undefined'
        const imageUrl = `http://localhost:3000/uploads/products/${file.filename}`;
        const isPrimary = i === primaryIdx;

        // Reutilizamos tu lógica existente en productImagesService para guardar y controlar 'isPrimary'
        await this.productImagesService.create({
          productId: id,
          imageUrl: imageUrl,
          isPrimary: isPrimary,
        });
      }
    }

    // (Opcional) Aquí también podrías añadir la lógica para actualizar o crear nuevas variantes
    // iterando sobre el array 'variants' que extrajimos en el paso 1.

    // 4. Retornamos el producto actualizado con sus relaciones
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
  }
}

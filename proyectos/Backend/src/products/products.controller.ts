/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductImagesService } from '../product-images/product-images.service';
import { ProductVariantsService } from '../product-variants/product-variants.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly imagesService: ProductImagesService,
    private readonly variantsService: ProductVariantsService,
  ) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(+id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Solo imágenes permitidas'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createWithImages(
    @Body() productData: any,
    @UploadedFiles() files: Record<string, any>[],
  ): Promise<Product> {
    // 1. Preparar las variantes
    let parsedVariants = [];
    if (productData.variants) {
      parsedVariants =
        typeof productData.variants === 'string'
          ? JSON.parse(productData.variants)
          : productData.variants;
    }

    // 2. Guardar el producto base PRIMERO para obtener un ID válido
    const product = await this.productsService.create({
      name: productData.name,
      brand: productData.brand,
      description: productData.description,
      topNotes: productData.topNotes,
      heartNotes: productData.heartNotes,
      baseNotes: productData.baseNotes,
      variants: parsedVariants, // La cascada de las variantes sí funciona bien
    });

    // 3. Procesar y guardar imágenes usando tu servicio especializado
    if (files && files.length > 0) {
      // Usamos un bucle for...of para respetar la asincronía (await)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isPrimary = productData.primaryImageIndex
          ? i === +productData.primaryImageIndex
          : i === 0;

        await this.imagesService.create({
          productId: product.id, // <-- Aquí está la magia: usamos el ID que acaba de nacer
          imageUrl: `http://localhost:3000/uploads/products/${file.filename}`,
          isPrimary: isPrimary,
        });
      }
    }

    // 4. Devolvemos el producto completo con todas sus relaciones recargadas
    return await this.productsService.findOne(product.id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      /* tu configuración de storage */
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() productData: any,
    @UploadedFiles() files: Record<string, any>[],
  ) {
    // 1. Datos del producto base
    const updatePayload = {
      name: productData.name,
      brand: productData.brand,
      description: productData.description,
      topNotes: productData.topNotes || '',
      heartNotes: productData.heartNotes || '',
      baseNotes: productData.baseNotes || '',
    };
    await this.productsService.update(+id, updatePayload);

    // 2. ¡Aquí usamos tu servicio directamente!
    if (productData.variants) {
      try {
        const variants = JSON.parse(productData.variants);
        if (variants && variants.length > 0) {
          const baseVariant = variants[0];
          if (baseVariant.id) {
            // Llama directo al service de variantes que ya tenías creado
            await this.variantsService.update(+baseVariant.id, {
              price: parseFloat(baseVariant.price) || 0,
              stock: parseInt(baseVariant.stock) || 0,
            });
          } else {
            // Si no hay ID por alguna razón, lo busca usando el método de tu servicio
            const existingVariants =
              await this.variantsService.findByProduct(+id);
            if (existingVariants && existingVariants.length > 0) {
              await this.variantsService.update(existingVariants[0].id, {
                price: parseFloat(baseVariant.price) || 0,
                stock: parseInt(baseVariant.stock) || 0,
              });
            }
          }
        }
      } catch (e) {
        console.error('Error al actualizar variante:', e);
      }
    }

    // 3. ¡AQUÍ ESTÁ EL CAMBIO CON TU SERVICIO DE VARIANTES!
    if (productData.variants) {
      try {
        const variants = JSON.parse(productData.variants);

        if (variants && variants.length > 0) {
          const baseVariant = variants[0];

          // Tu payload de React envía el ID de la variante si ya existía:
          // editingProduct?.variants?.[0]?.id -> lo pusimos en el FormData como payload
          if (baseVariant.id) {
            // Si la variante ya tiene ID, la actualizamos usando tu método .update(id, data)
            await this.variantsService.update(+baseVariant.id, {
              price: parseFloat(baseVariant.price) || 0,
              stock: parseInt(baseVariant.stock) || 0,
            });
          } else {
            // Por seguridad, si por alguna razón no venía con ID, la buscamos por el productId
            const existingVariants =
              await this.variantsService.findByProduct(+id);
            if (existingVariants && existingVariants.length > 0) {
              await this.variantsService.update(existingVariants[0].id, {
                price: parseFloat(baseVariant.price) || 0,
                stock: parseInt(baseVariant.stock) || 0,
              });
            }
          }
        }
      } catch (e) {
        console.error('Error al procesar la actualización de la variante:', e);
      }
    }

    // 4. Procesar nuevas imágenes (Si las hay)
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isPrimary = productData.primaryImageIndex
          ? i === +productData.primaryImageIndex
          : false;

        await this.imagesService.create({
          productId: +id,
          imageUrl: `http://localhost:3000/uploads/products/${file.filename}`,
          isPrimary: isPrimary,
        });
      }
    }

    // 5. Retornar el producto completamente refrescado con sus relaciones
    return await this.productsService.findOne(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(+id);
  }
}

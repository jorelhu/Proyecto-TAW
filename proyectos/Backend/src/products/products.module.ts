import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductImagesModule } from '../product-images/product-images.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module'; // <-- IMPORTA TU MÓDULO

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductImagesModule,
    ProductVariantsModule, // <-- AÑÁDELO AQUÍ
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

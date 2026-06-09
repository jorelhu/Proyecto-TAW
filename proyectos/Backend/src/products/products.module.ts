import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { ProductImagesModule } from '../product-images/product-images.module'; // <-- IMPORTA TU MÓDULO

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductImagesModule, // <-- AÑÁDELO AQUÍ
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}

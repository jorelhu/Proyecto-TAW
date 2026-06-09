import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';

// Importar entidades
import { Usuario } from './users/usuario.entity';
import { Product } from './products/product.entity';
import { ProductImage } from './product-images/product-image.entity';
import { ProductVariant } from './product-variants/product-variant.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'aura_nova_db',
      entities: [
        Usuario,
        Product,
        ProductImage,
        ProductVariant,
        Order,
        OrderItem,
      ],
      synchronize: false,
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    ProductImagesModule,
    ProductVariantsModule,
  ],
})
export class AppModule {}

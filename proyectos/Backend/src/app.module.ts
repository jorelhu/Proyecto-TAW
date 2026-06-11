import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
// Importar entidades
import { Usuario } from './users/usuario.entity';
import { Product } from './products/product.entity';
import { ProductImage } from './product-images/product-image.entity';
import { ProductVariant } from './product-variants/product-variant.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { AccessLog } from './access-logs/access-log.entity';
import { AccessLogsModule } from './access-logs/access-logs.module';
import { AuthModule } from './auth/auth.module';

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
        AccessLog,
      ],
      synchronize: false,
    }),
    ServeStaticModule.forRoot({
      // Apunta directamente a tu carpeta física de subidas
      rootPath: join(__dirname, '..', 'uploads'),
      // El prefijo que usarás en la URL del navegador
      serveRoot: '/static',
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    ProductImagesModule,
    ProductVariantsModule,
    AccessLogsModule,
    AuthModule,
  ],
})
export class AppModule {}

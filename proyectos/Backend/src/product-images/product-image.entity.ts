// src/product-images/product-image.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';

@Entity('productimage')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'productId' })
  productId: number;

  @Column({ length: 255 })
  imageUrl: string;

  @Column({ name: 'isPrimary', type: 'tinyint', default: 0 })
  isPrimary: boolean;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

// src/products/product.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductImage } from '../product-images/product-image.entity';
import { ProductVariant } from '../product-variants/product-variant.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  brand: string;

  @Column('text')
  description: string;

  @Column({ length: 255, nullable: true })
  topNotes: string;

  @Column({ length: 255, nullable: true })
  heartNotes: string;

  @Column({ length: 255, nullable: true })
  baseNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}

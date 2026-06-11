import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { OrderItem } from '../orders/order-item.entity';

@Entity('productvariant')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'productId' })
  productId!: number;

  @Column({ length: 100 })
  size!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 0 })
  stock!: number;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'productId' })
  product!: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  orderItems!: OrderItem[];
}

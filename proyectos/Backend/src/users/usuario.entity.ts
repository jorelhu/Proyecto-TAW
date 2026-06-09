// src/users/usuario.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../orders/order.entity';
import { AccessLog } from '../access-logs/access-log.entity';

// Definimos los roles que maneja AURA NOVA
export type UserRole = 'USER' | 'ADMIN';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  // NUEVA COLUMNA: Rol de usuario con TypeORM Enum
  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
    select: true,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => AccessLog, (accessLog) => accessLog.user)
  accessLogs: AccessLog[];
}

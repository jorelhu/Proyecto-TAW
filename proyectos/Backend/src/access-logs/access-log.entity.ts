import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../users/usuario.entity';
export type EventType = 'LOGIN' | 'LOGOUT';

@Entity('access_log')
export class AccessLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId' })
  userId: number;

  @Column({ length: 45 })
  ipAddress: string;

  @Column({
    type: 'enum',
    enum: ['LOGIN', 'LOGOUT'],
    default: 'LOGIN',
  })
  eventType: EventType;

  @Column({ length: 255 })
  browser: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.accessLogs)
  @JoinColumn({ name: 'userId' })
  user: Usuario;
}

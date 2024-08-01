import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { CartEntity } from './Cart';
import { UserEntity } from './User';


@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user_id: UserEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.orders)
  cart_id: CartEntity;

  @Column('json')
  payment: string;

  @Column('json')
  delivery: string;

  @Column('text')
  comments: string;

  @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'CANCELLED'] })
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';

  @Column('decimal')
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
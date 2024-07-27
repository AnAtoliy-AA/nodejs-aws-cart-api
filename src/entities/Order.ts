import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CartEntity } from './Cart';
import { UserEntity } from './User';
import { OrderStatuses } from '../order/models';


@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.orders, { nullable: false })
  user: UserEntity;

  @OneToOne(() => CartEntity, (cart) => cart.order, {
    nullable: true,
  })
  @JoinColumn()
  cart: CartEntity;

  @Column({ type: 'json' })
  payment: string;

  @Column({ type: 'json' })
  delivery: string;

  @Column({ type: 'varchar', nullable: true })
  comments: string;

  @Column({
    type: 'enum',
    enum: OrderStatuses,
    nullable: true
  })
  status: OrderStatuses;

  @Column({ type: 'integer' })
  total: number;
}
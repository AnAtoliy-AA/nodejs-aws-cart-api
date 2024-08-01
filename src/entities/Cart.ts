import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CartItemEntity } from './CartItem';
import { CartStatuses } from '../cart/models';
import { OrderEntity } from './Order';

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'enum', enum: CartStatuses })
  status: CartStatuses;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  items: CartItemEntity[];

  @OneToMany(() => OrderEntity, (order) => order.cart_id)
  orders: OrderEntity[];
}

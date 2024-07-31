import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CartItemEntity } from "./CartItem";
import { CartStatuses } from "../cart/models";
import { UserEntity } from "./User";
import { OrderEntity } from "./Order";

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ type: 'enum', enum: CartStatuses })
  status: CartStatuses;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  items: CartItemEntity[];

  @OneToMany(() => OrderEntity, (order) => order.cart_id)
  orders: OrderEntity[];
}

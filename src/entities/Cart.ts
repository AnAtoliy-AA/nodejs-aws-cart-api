import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { CartItemEntity } from "./CartItem";
import { CartStatuses } from "../cart/models";
import { UserEntity } from "./User";
import { OrderEntity } from "./Order";

@Entity()
export class CartEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  user_id: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column({
    type: "enum",
    enum: CartStatuses,
  })
  status: CartStatuses;

  @ManyToOne(() => UserEntity, (user) => user.carts, { nullable: false })
  user: UserEntity;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    cascade: true,
  })
  items: CartItemEntity[];

  @OneToOne(() => OrderEntity, (order) => order.cart, {
    nullable: true,
  })
  order: OrderEntity;
}
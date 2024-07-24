import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItemEntity } from "./CartItem";
import { CartStatuses } from "src/cart";

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

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart)
  items: CartItemEntity[];
}
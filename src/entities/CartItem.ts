import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { CartEntity } from "./Cart";

@Entity()
export class CartItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: CartEntity;

  @Column()
  product_id: string;

  @Column()
  count: number;
}
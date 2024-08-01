import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartEntity } from './Cart';
import { ProductEntity } from './Product';
import { Cart, Product } from 'src/cart';

@Entity('cart_items')
export class CartItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn()
  cart_id: string;

  @PrimaryColumn()
  product_id: string;

  @Column('int')
  count: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

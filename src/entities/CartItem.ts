import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CartEntity } from './Cart';
import { ProductEntity } from './Product';
import { Cart, Product } from 'src/cart';

@Entity('cartItems')
export class CartItemEntity {
  @PrimaryColumn()
  cart_id: string;

  @PrimaryColumn()
  product_id: string;

  @Column('int')
  count: number;

  @ManyToOne(() => CartEntity, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => ProductEntity, (product) => product.cartItems)
  product: Product;
}

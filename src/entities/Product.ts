import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { CartItemEntity } from './CartItem';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'decimal' })
  price: number;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItems: CartItemEntity[];
}

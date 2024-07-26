import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { CartEntity } from './Cart';
import { ProductEntity } from './Product';

@Entity()
export class CartItemEntity {
  constructor(partialEntity: Partial<CartItemEntity>) {
    Object.assign(this, partialEntity);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CartEntity, (cart) => cart.items, { nullable: false })
  cart: CartEntity;

  @Column()
  product_id: string;

  @Column({ type: 'integer' })
  count: number;

  @OneToOne(() => ProductEntity, (product) => product.cartItem, {
    cascade: ['insert', 'remove'],
    nullable: false,
  })
  @JoinColumn()
  product: ProductEntity;
}

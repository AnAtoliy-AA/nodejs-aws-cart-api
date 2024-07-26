import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { CartItemEntity } from './CartItem';

@Entity('products')
export class ProductEntity {
  constructor(partialEntity: Partial<CartItemEntity>) {
    Object.assign(this, partialEntity);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('varchar')
  description: string;

  @Column({ type: 'integer' })
  price: number;

  @OneToOne(() => CartItemEntity, (cartItem) => cartItem.product, {
    nullable: false,
  })
  cartItem: CartItemEntity;
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';

import { CartStatuses, Cart } from '../models';
import { CartEntity } from 'src/entities/Cart';
import { CartItemEntity } from 'src/entities/CartItem';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private cartItemsRepository: Repository<CartItemEntity>,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  private userCarts: Record<string, CartEntity> = {};

  async findByUserId(userId: string): Promise<CartEntity> {
    return this.userCarts[ userId ];
  }

  async createByUserId(userId: string) {
    const id = v4();
    const userCart = {
      id,
      items: [],
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
      status: CartStatuses.OPEN
    };

    this.userCarts[ userId ] = userCart;

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: CartEntity): Promise<CartEntity> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId: string): void {
    this.userCarts[ userId ] = null;
  }

}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';

import { CartStatuses } from '../';
import { CartItemEntity } from '../../entities/CartItem';
import { Repository } from 'typeorm';
import { CartEntity } from '../../entities/Cart';
import { UserEntity } from '../../entities/User';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private cartItemsRepository: Repository<CartItemEntity>,
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  async findByUserId(userId: string) {
    return await this.cartRepository.findOne({
      where: {
        status: CartStatuses.OPEN,
        user: {
          id: userId,
        },
      },
      relations: {
        items: {
          product: true,
        },
      },
    });
  }

  async createByUserId(userId: string) {
    const cart = this.cartRepository.create({
      status: CartStatuses.OPEN,
    });

    cart.user = new UserEntity({
      id: userId,
    });

    const createdCart = await this.cartRepository.save(cart);

    return await this.cartRepository.findOne({
      where: {
        id: createdCart.id,
      },
      relations: {
        items: {
          product: true,
        },
      },
    });
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    { items }: CartEntity,
  ): Promise<CartEntity> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    // this.userCarts[ userId ] = { ...updatedCart };

    return { ...updatedCart };
  }

  removeByUserId(userId: string): void {
    // this.userCarts[ userId ] = null;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 } from 'uuid';

import { CartStatuses } from '../';
import { CartItemEntity } from '../../entities/CartItem';
import { Repository } from 'typeorm';
import { CartEntity } from '../../entities/Cart';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemsRepository: Repository<CartItemEntity>,
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}
  async findByUserId(userId: string): Promise<CartEntity | undefined> {
    return this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .where('cart.user_id = :userId', { userId })
      .andWhere('cart.status = :status', { status: 'OPEN' })
      .getOne();
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    let cart = await this.findByUserId(userId);
    if (!cart) {
      cart = this.cartRepository.create({
        user_id: userId ?? v4(),
        status: CartStatuses.OPEN,
        created_at: new Date(),
        updated_at: new Date(),
      });
      await this.cartRepository.save(cart);
    }
    return cart;
  }

  async createByUserId(userId: string) {
    const cart = this.cartRepository.create({
      status: CartStatuses.OPEN,
    });

    // cart.users = new UserEntity({
    //   id: userId,
    // });

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

  // async findOrCreateByUserId(userId: string): Promise<CartEntity> {
  //   const userCart = await this.findByUserId(userId);

  //   if (userCart) {
  //     return userCart;
  //   }

  //   return this.createByUserId(userId);
  // }

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

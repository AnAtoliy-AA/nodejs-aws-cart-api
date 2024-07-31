import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { OrderService } from 'src/order';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from '../entities/Cart';
import { CartItemEntity } from '../entities/CartItem';

@Module({
  imports: [
    OrderModule,
    TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
  ],
  providers: [CartService, OrderService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}

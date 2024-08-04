import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { dataSourceOptions } from './data-source';
import { CartEntity } from './entities/Cart';
import { CartItemEntity } from './entities/CartItem';
import { OrderEntity } from './entities/Order';
import { ProductEntity } from './entities/Product';
import { UserEntity } from './entities/User';

dotenv.config();

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([
      CartEntity,
      CartItemEntity,
      OrderEntity,
      ProductEntity,
      UserEntity,
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

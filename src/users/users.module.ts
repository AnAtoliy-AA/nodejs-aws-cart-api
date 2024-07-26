import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/User';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

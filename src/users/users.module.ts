import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

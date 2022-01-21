import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { UserRepository } from './repository/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}

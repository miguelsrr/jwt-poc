import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly log = new Logger('User');

  async createUser(payload: CreateUserDto): Promise<Partial<User>> {
    try {
      const newUser: User = this.create({ ...payload });

      await this.save(newUser);

      return {
        name: newUser.name,
        lastName: newUser.lastName,
        email: newUser.email,
      };
    } catch (error) {
      this.log.error(error);
    }
  }
}

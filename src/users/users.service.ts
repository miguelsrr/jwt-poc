import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './repository/users.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const exist = await this.findByEmail(createUserDto.email);
      if (exist) {
        throw new Error('Already exists');
      }
      return this.userRepository.createUser(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  findCredentialsLogin(email: string) {
    return this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

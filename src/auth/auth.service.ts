import { Injectable } from '@nestjs/common';
import { UserService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/repository/users.repository';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository)
    private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const validatedUser = await user.validatePassword(pass);

    if (user && validatedUser) {
      return user;
    }
    return null;
  }

  async createToken(user: User) {
    const { id, email } = user;
    const access_token = this.jwtService.sign({
      sub: id,
      email,
    });
    const { iat } = this.jwtService.decode(access_token) as any;
    await this.userRepo.query(
      `UPDATE "user" SET "jwtIds" = array_append("jwtIds", '${
        iat + id
      }') WHERE "id" = '${id}'`,
    );
    return {
      access_token,
    };
  }

  async removePreviousJwtId(payload) {
    const { iat, sub } = this.jwtService.decode(payload) as any;
    await this.userRepo.query(
      `UPDATE "user" SET "jwtIds" = array_remove("jwtIds", '${
        iat + sub
      }') WHERE "id" = '${sub}'`,
    );
  }
}

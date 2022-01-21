import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repository/users.repository';
import { Repository } from 'typeorm';

@Injectable()
export class JwtIds implements CanActivate {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepo: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization.replace('Bearer', '').trim();
    const { iat, sub } = this.jwt.decode(token) as any;
    const checkTokenAlive = await this.userRepo.query(
      `select "id" COUNT FROM "user" where '${iat + sub}'=any("jwtIds")`,
    );
    if (checkTokenAlive && checkTokenAlive.length) {
      return true;
    }
    return false;
  }
}

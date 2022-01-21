import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Headers,
} from '@nestjs/common';
import { UserService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtIds } from './validate-jwtIds.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() request) {
    const user = request.user;
    delete user.password;
    const { access_token } = await this.authService.createToken(request.user);
    return {
      ...user,
      access_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Headers('Authorization') auth: string) {
    await this.authService.removePreviousJwtId(
      auth.replace('Bearer', '').trim(),
    );
    return req.user;
  }

  @UseGuards(JwtAuthGuard, JwtIds)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

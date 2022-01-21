import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  private readonly log = new Logger('User');

  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      return { result: newUser, message: 'User created' };
    } catch (error) {
      this.log.error(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

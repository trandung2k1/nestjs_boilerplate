import { LogInterceptor } from 'src/shared/interceptors/log.interceptor';
import { UsersService } from './users.service';
import { Controller, Get, UseInterceptors } from '@nestjs/common';

@UseInterceptors(new LogInterceptor('UserResult'))
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/')
  getAllUser() {
    return this.usersService.getAllUser();
  }
}

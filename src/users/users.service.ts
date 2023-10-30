import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseCRUDService } from 'src/shared/base/base-crud.service';
import { User } from 'src/shared/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends BaseCRUDService<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }
  async getAllUser(): Promise<{ id: number; name: string }[]> {
    return [
      { id: 1, name: 'Tran Dung' },
      { id: 2, name: 'Dung Henry' },
    ];
  }
}

import {
  NotFoundException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { IBaseIdentityEntity } from '../interfaces/base-identity.interface';
import { PaginationModel } from './pagination.model';
import { PaginationResult } from './pagination.result';

export class BaseCRUDService<EntityClass extends IBaseIdentityEntity> {
  readonly repository: Repository<EntityClass>;
  constructor(primaryRepository: Repository<EntityClass>) {
    this.repository = primaryRepository;
  }

  async create(model: DeepPartial<EntityClass>) {
    const entity: EntityClass = this.repository.create(model);
    try {
      return await this.repository.save(entity, {
        reload: true,
      });
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async update(
    id: string,
    model: DeepPartial<EntityClass>,
  ): Promise<EntityClass> {
    const where = { id } as FindOptionsWhere<EntityClass>;
    let entity: any = await this.repository.findOneBy(where);
    if (!entity) {
      throw new NotFoundException('Tài khoản không tồn tại');
    }
    entity = this.repository.merge(entity, model as DeepPartial<EntityClass>);
    await this.repository.save(entity);
    return entity;
  }

  async createMany(models: DeepPartial<EntityClass>[]): Promise<EntityClass[]> {
    const entities: EntityClass[] = this.repository.create(models);
    try {
      return await this.repository.save(entities, {
        reload: true,
      });
    } catch (error) {
      throw new UnprocessableEntityException(error);
    }
  }

  async get(
    optionsWhere: FindOptionsWhere<EntityClass>,
    optionRelations?: FindOptionsRelations<EntityClass> | string[],
  ) {
    return this.repository.findOne({
      where: optionsWhere,
      relations: optionRelations,
    });
  }

  async getOrThrow(
    optionsWhere: FindOptionsWhere<EntityClass>,
    optionRelations?: FindOptionsRelations<EntityClass> | string[],
  ) {
    const entity = await this.repository.findOne({
      where: optionsWhere,
      relations: optionRelations,
    });
    if (!entity) throw new NotFoundException('Không tìm thấy bản ghi phù hợp');
    return entity;
  }

  async find(
    optionsWhere: FindOptionsWhere<EntityClass>,
    optionsOrder?: FindOptionsOrder<EntityClass>,
    optionRelations?: FindOptionsRelations<EntityClass> | string[],
  ) {
    return this.repository.find({
      where: optionsWhere,
      order: optionsOrder,
      relations: optionRelations,
    });
  }

  async paginate(
    optionsWhere:
      | FindOptionsWhere<EntityClass>
      | FindOptionsWhere<EntityClass>[],
    pagination: PaginationModel,
    optionRelations?: FindOptionsRelations<EntityClass> | string[],
  ): Promise<PaginationResult> {
    const order: any = {
      createdAt: {
        direction: 'DESC',
      },
    };
    const [items, total] = await this.repository.findAndCount({
      where: optionsWhere,
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      relations: optionRelations,
      order: order,
    });
    return {
      items,
      total,
    };
  }

  async checkExist(
    optionsWhere: FindOptionsWhere<EntityClass>,
    message: string,
  ) {
    const exist = await this.repository.findOne({
      where: optionsWhere,
    });
    if (exist)
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
  }

  async delete(optionsWhere: FindOptionsWhere<EntityClass>) {
    const entity = await this.getOrThrow(optionsWhere);
    await this.repository.delete(entity.id);
  }

  async softDelete(optionsWhere: FindOptionsWhere<EntityClass>) {
    const entity = await this.getOrThrow(optionsWhere);
    await this.repository.softDelete(entity.id);
  }

  async deleteMany(arrayIds: string[]) {
    await this.repository.softDelete(arrayIds);
  }
}

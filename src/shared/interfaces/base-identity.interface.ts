import { BaseEntity } from 'typeorm';

export interface IBaseIdentityEntity extends BaseEntity {
  id: string;

  createdAt: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}

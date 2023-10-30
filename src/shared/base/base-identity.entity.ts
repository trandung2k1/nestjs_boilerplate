import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Exclude()
export class BaseIdentityEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'Id',
  })
  @ApiProperty()
  @Expose()
  id: string;

  @CreateDateColumn({
    name: 'CreatedAt',
    type: 'datetime',
  })
  @ApiHideProperty()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ name: 'UpdatedAt', type: 'datetime' })
  @ApiHideProperty()
  @Exclude()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  @DeleteDateColumn({
    name: 'DeletedAt',
    type: 'datetime',
  })
  deletedAt?: Date;

  @Column({
    name: 'CreatedByUserId',
    type: 'uniqueidentifier',
    nullable: true,
  })
  createdByUserId?: string;

  @Column({
    name: 'UpdatedByUserId',
    type: 'uniqueidentifier',
    nullable: true,
  })
  updatedByUserId?: string;
}

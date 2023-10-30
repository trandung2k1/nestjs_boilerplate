import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BaseIdentityEntity } from 'src/shared/base/base-identity.entity';
import { UserStatus } from 'src/shared/constant/user.enum';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity('User')
export class User extends BaseIdentityEntity {
  @Column('nvarchar', {
    length: 255,
    name: 'Name',
    nullable: true,
  })
  @ApiProperty()
  name: string;

  @Column('nvarchar', {
    length: 64,
    name: 'LoginName',
    nullable: false,
    unique: true,
  })
  @ApiProperty()
  loginName: string;

  @Column('nvarchar', {
    length: 64,
    nullable: false,
    name: 'Password',
  })
  @Exclude()
  password: string;

  @Column('char', {
    length: 1,
    name: 'Status',
    nullable: false,
    default: UserStatus.ACTIVE,
  })
  @ApiProperty({
    enum: UserStatus,
    type: UserStatus,
  })
  status: UserStatus;

  @Column('bit', {
    nullable: false,
    default: false,
    name: 'IsAdmin',
  })
  @ApiProperty()
  isAdmin: boolean;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
    unique: true,
    name: 'Email',
  })
  @ApiProperty()
  email: string;

  @BeforeInsert()
  checkLocalPasswordInsert() {
    if (this.password === null) {
      throw new UnprocessableEntityException('Mật khẩu là bắt buộc');
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  updatePassword(newPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(newPassword, salt);
  }

  compareLocalPassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }
}

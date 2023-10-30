import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ObjectType } from 'typeorm';

export interface IPaginationResult {
  total: number;
  items: Array<any>;
}

@Exclude()
export class PaginationResult implements IPaginationResult {
  @ApiProperty({
    description: 'Tổng số bản ghi',
  })
  @Expose()
  total: number;

  @ApiProperty({
    description: 'Dữ liệu bản ghi kết quả',
    type: 'object',
  })
  @Expose()
  items: Array<any>;
}

export function ExtraPaginationResult<T>(classType: ObjectType<T>) {
  class ResultClass {
    @ApiProperty({
      description: 'Tổng số bản ghi',
      type: Number,
    })
    @Expose()
    total: number;

    @ApiProperty({
      description: 'Dữ liệu bản ghi kết quả',
      type: classType,
      isArray: true,
    })
    @Expose()
    items: Array<T>;
  }
  return ResultClass;
}

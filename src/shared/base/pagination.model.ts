import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export interface IPaginationModel {
  page?: number;
  size?: number;
}

export class PaginationModel implements IPaginationModel {
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Trang hiện tại, mặc định là 1',
  })
  page?: number = 1;

  @IsNumber()
  @Min(5)
  @Max(1000)
  @ApiProperty({
    description: 'Số kết quả trả về tối đa mỗi trang',
  })
  size?: number = 10;
}

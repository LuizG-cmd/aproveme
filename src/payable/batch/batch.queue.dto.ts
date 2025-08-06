import { IsArray, IsNotEmpty, ArrayMaxSize } from 'class-validator';
import { CreatePayableDto } from '../dto/create-payable.dto';

export class BatchCreateDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMaxSize(10000)
  payables: CreatePayableDto[];
}

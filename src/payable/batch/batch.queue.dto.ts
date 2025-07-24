import { IsArray, IsNotEmpty } from 'class-validator';
import { CreatePayableDto } from '../dto/create-payable.dto';

export class BatchCreateDto {
  @IsArray()
  @IsNotEmpty()
  payables: CreatePayableDto[];
}

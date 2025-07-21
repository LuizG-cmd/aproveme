import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdatePayableDto {
  @IsNumber()
  @IsOptional()
  value: number;

  @IsDateString({}, { message: 'Emission date is not a valid date' })
  @IsOptional()
  emissionDate: Date;

  @IsNotEmpty({ message: 'Assignor ID is required' })
  assignorId: string;
}

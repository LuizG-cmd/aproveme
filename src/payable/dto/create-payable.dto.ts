import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePayableDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Value is required' })
  value: number;

  @IsDateString({}, { message: 'Emission date is not a valid date' })
  @IsNotEmpty({ message: 'Emission date is required' })
  emissionDate: Date;

  @IsNotEmpty({ message: 'Assignor ID is required' })
  assignorId: string;
}

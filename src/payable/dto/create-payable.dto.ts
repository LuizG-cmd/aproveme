import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsPositive,
} from 'class-validator';

export class CreatePayableDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Value is required' })
  @IsPositive({ message: 'The payable value must be positive' })
  value: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Emission date is required' })
  emissionDate: Date;

  @IsNotEmpty({ message: 'Assignor ID is required' })
  @IsUUID('4')
  assignorId: string;
}

import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty()
  document: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(140)
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  @ApiProperty()
  name: string;
}

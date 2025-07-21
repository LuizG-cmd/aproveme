import { IsString, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateAssignorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  document: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(140)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(140)
  name: string;
}

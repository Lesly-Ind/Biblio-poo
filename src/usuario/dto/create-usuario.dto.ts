import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  apellidos!: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsNumber()
  rolId!: number;
}
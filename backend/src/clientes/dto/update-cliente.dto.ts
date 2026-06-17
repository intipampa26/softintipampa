import {
  IsString,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nroDocumento?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  pais?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

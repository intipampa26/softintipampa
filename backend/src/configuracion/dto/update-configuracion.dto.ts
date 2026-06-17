import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateConfiguracionDto {
  @IsOptional() @IsString() @MaxLength(300)
  nombreEmpresa?: string | null;

  @IsOptional() @IsString() @MaxLength(20)
  ruc?: string | null;

  @IsOptional() @IsString()
  direccion?: string | null;

  @IsOptional() @IsString() @MaxLength(50)
  telefono?: string | null;

  @IsOptional() @IsString() @MaxLength(200)
  email?: string | null;

  @IsOptional() @IsString() @MaxLength(500)
  logoUrl?: string | null;

  @IsOptional() @IsString() @MaxLength(100)
  pais?: string | null;

  @IsOptional() @IsString() @MaxLength(10)
  moneda?: string | null;

  @IsOptional() @IsString()
  variedades?: string | null;
}

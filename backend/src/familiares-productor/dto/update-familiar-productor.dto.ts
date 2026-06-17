
import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Parentesco, TipoDocumento, Sexo } from '../familiar-productor.entity';

export class UpdateFamiliarProductorDto {
  @IsString() @IsOptional() @MaxLength(200)
  nombres?: string;

  @IsString() @IsOptional() @MaxLength(200)
  apellidos?: string;

  @IsEnum(Parentesco, { message: 'Parentesco no válido' }) @IsOptional()
  parentesco?: Parentesco;

  @IsEnum(Sexo, { message: 'Sexo no válido' }) @IsOptional()
  sexo?: Sexo;

  @IsDateString({}, { message: 'Fecha de nacimiento debe tener formato YYYY-MM-DD' }) @IsOptional()
  fechaNacimiento?: string;

  @IsEnum(TipoDocumento, { message: 'Tipo de documento no válido' }) @IsOptional()
  tipoDocumento?: TipoDocumento;

  @IsString() @IsOptional() @MaxLength(50)
  nroDocumento?: string;

  @IsString() @IsOptional() @MaxLength(20)
  telefono?: string;

  @IsEmail({}, { message: 'El correo no tiene formato válido' }) @IsOptional() @MaxLength(200)
  correo?: string;

  @IsString() @IsOptional()
  direccion?: string;

  @IsString() @IsOptional()
  observaciones?: string;

  @IsBoolean() @IsOptional()
  activo?: boolean;
}

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsInt,
  IsEnum,
  IsDateString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductorTipoProducto, ProductorTipoProductor } from '../productor.entity';

export class CreateProductorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre / razón social es requerido' })
  @MaxLength(200)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  apellido?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  nroDocumento?: string;

  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  fotoUrl?: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsOptional()
  @MaxLength(200)
  email?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString() @IsOptional() @MaxLength(100) departamento?: string;
  @IsString() @IsOptional() @MaxLength(100) provincia?: string;
  @IsString() @IsOptional() @MaxLength(100) distrito?: string;
  @IsString() @IsOptional() @MaxLength(10)  codigoUbigeo?: string;

  @IsEnum(ProductorTipoProducto, { message: 'Tipo de producto no válido' })
  @IsOptional()
  tipoProducto?: ProductorTipoProducto;

  @IsEnum(ProductorTipoProductor, { message: 'Tipo de productor no válido' })
  @IsOptional()
  tipoProductor?: ProductorTipoProductor;

  @IsBoolean()
  @IsOptional()
  esApto?: boolean;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  campanaId?: number | null;

  

  @IsString() @IsOptional() @MaxLength(200)
  familiarNombreProductor?: string;

  @IsInt() @IsOptional() @Type(() => Number)
  familiarEdadProductor?: number;

  @IsString() @IsOptional() @MaxLength(50)
  familiarEstadoCivil?: string;

  @IsString() @IsOptional() @MaxLength(50)
  familiarGradoInstruccion?: string;

  @IsString() @IsOptional() @MaxLength(200)
  conyugeNombre?: string;

  @IsInt() @IsOptional() @Type(() => Number)
  conyugeEdad?: number;

  @IsString() @IsOptional() @MaxLength(100)
  conyugeOcupacion?: string;

  @IsString() @IsOptional() @MaxLength(50)
  conyugeGradoInstruccion?: string;

   
  @IsString() @IsOptional()
  hijosData?: string;

  

  @IsBoolean() @IsOptional()
  tieneEnfermedadEspecial?: boolean;

  @IsString() @IsOptional()
  enfermedadesPreexistentes?: string;

  @IsString() @IsOptional() @MaxLength(50)
  seguroMedico?: string;

  

  @IsBoolean() @IsOptional() tieneAgua?: boolean;
  @IsBoolean() @IsOptional() tieneDesague?: boolean;
  @IsBoolean() @IsOptional() tieneLuz?: boolean;
  @IsBoolean() @IsOptional() tieneInternet?: boolean;
  @IsBoolean() @IsOptional() tieneBanio?: boolean;

  @IsString() @IsOptional() @MaxLength(100) empresaTipo?: string;
  @IsString() @IsOptional() @MaxLength(200) empresaGerenteGeneral?: string;
  @IsInt()    @IsOptional() @Type(() => Number) empresaAnioInicio?: number;
  @IsString() @IsOptional() empresaInfoLegal?: string;
  @IsString() @IsOptional() @MaxLength(200) empresaNombreComercial?: string;
  @IsString() @IsOptional() @MaxLength(200) empresaAcopiador?: string;
  @IsString() @IsOptional() empresaInfoSunat?: string;
  @IsInt()    @IsOptional() @Type(() => Number) empresaCantTrabajadores?: number;
}

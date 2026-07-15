import {
  IsString,
  IsOptional,
  IsEmail,
  IsBoolean,
  IsInt,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductorTipoProducto, ProductorTipoProductor } from '../productor.entity';

export class UpdateProductorDto {
  @IsString() @IsOptional() @MaxLength(200) nombre?: string;
  @IsString() @IsOptional() @MaxLength(200) apellido?: string;
  @IsString() @IsOptional() @MaxLength(50)  nroDocumento?: string;

  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  @IsOptional() fecha?: string;

  @IsString() @IsOptional() @MaxLength(20)  telefono?: string;
  @IsString() @IsOptional() @MaxLength(500) fotoUrl?: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsOptional() @MaxLength(200) email?: string;

  @IsString() @IsOptional() descripcion?: string;
  @IsString() @IsOptional() direccion?: string;
  @IsString() @IsOptional() @MaxLength(100) departamento?: string;
  @IsString() @IsOptional() @MaxLength(100) provincia?: string;
  @IsString() @IsOptional() @MaxLength(100) distrito?: string;
  @IsString() @IsOptional() @MaxLength(10)  codigoUbigeo?: string;

  @IsEnum(ProductorTipoProducto, { message: 'Tipo de producto no válido' })
  @IsOptional() tipoProducto?: ProductorTipoProducto;

  @IsEnum(ProductorTipoProductor, { message: 'Tipo de productor no válido' })
  @IsOptional() tipoProductor?: ProductorTipoProductor;

  @IsBoolean() @IsOptional() esApto?: boolean;
  @IsBoolean() @IsOptional() activo?: boolean;

  

  @IsString() @IsOptional() @MaxLength(200) familiarNombreProductor?: string;
  @IsInt()    @IsOptional() @Type(() => Number) familiarEdadProductor?: number;
  @IsString() @IsOptional() @MaxLength(50)  familiarEstadoCivil?: string;
  @IsString() @IsOptional() @MaxLength(50)  familiarGradoInstruccion?: string;

  @IsString() @IsOptional() @MaxLength(200) conyugeNombre?: string;
  @IsInt()    @IsOptional() @Type(() => Number) conyugeEdad?: number;
  @IsString() @IsOptional() @MaxLength(100) conyugeOcupacion?: string;
  @IsString() @IsOptional() @MaxLength(50)  conyugeGradoInstruccion?: string;

  @IsString() @IsOptional() hijosData?: string;

  

  @IsBoolean() @IsOptional() tieneEnfermedadEspecial?: boolean;
  @IsString()  @IsOptional() enfermedadesPreexistentes?: string;
  @IsString() @IsOptional() @MaxLength(50) seguroMedico?: string;

  

  @IsBoolean() @IsOptional() tieneAgua?: boolean;
  @IsBoolean() @IsOptional() tieneDesague?: boolean;
  @IsBoolean() @IsOptional() tieneLuz?: boolean;
  @IsBoolean() @IsOptional() tieneInternet?: boolean;
  @IsBoolean() @IsOptional() tieneBanio?: boolean;

  @IsString() @IsOptional() @MaxLength(100)  empresaTipo?: string | null;
  @IsString() @IsOptional() @MaxLength(200)  empresaGerenteGeneral?: string | null;
  @IsString() @IsOptional() @MaxLength(10)      empresaAnioInicio?: string | null;
  @IsString() @IsOptional()                  empresaInfoLegal?: string | null;
  @IsString() @IsOptional() @MaxLength(200)  empresaNombreComercial?: string | null;
  @IsString() @IsOptional() @MaxLength(200)  empresaAcopiador?: string | null;
  @IsString() @IsOptional()                  empresaInfoSunat?: string | null;
  @IsInt()    @IsOptional() @Type(() => Number) empresaCantTrabajadores?: number | null;

  @IsBoolean() @IsOptional() registradoSunat?: boolean | null;
  @IsBoolean() @IsOptional() activoSunat?: boolean | null;
  @IsBoolean() @IsOptional() declaroImpuestosPrevios?: boolean | null;

  @IsString() @IsOptional() @MaxLength(100) certificaciones?: string | null;

  @IsBoolean() @IsOptional() cuentaConPoliticas?: boolean | null;
  @IsString()  @IsOptional() cualesPoliticas?: string | null;

  @IsString() @IsOptional() @MaxLength(100) registrosGestionDatos?: string | null;

  @IsBoolean() @IsOptional() trabajadoresReglaSunafil?: boolean | null;

  @IsBoolean() @IsOptional() denunciasUsurpacion?: boolean | null;
  @IsString()  @IsOptional() cualesUsurpacion?: string | null;

  @IsBoolean() @IsOptional() denunciasCorrupcion?: boolean | null;
  @IsString()  @IsOptional() cualesCorrupcion?: string | null;

  @IsBoolean() @IsOptional() incidenciasVisita?: boolean | null;
  @IsString()  @IsOptional() cualesIncidencias?: string | null;
}

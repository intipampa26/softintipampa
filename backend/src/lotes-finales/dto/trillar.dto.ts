import {
  IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrillarDto {
  @IsDateString()
  fecha: string;

  @IsString() @IsOptional() @MaxLength(500) planta?: string;
  @IsString() @IsOptional() @MaxLength(100) malla?: string;
  @IsString() @IsOptional() @MaxLength(500) tipoSeleccion?: string;
  @IsString() @IsOptional() @MaxLength(500) encargado?: string;
  @IsInt()    @IsOptional() encargadoUsuarioId?: number;

   
  @IsNumber()
  @Min(0.001)
  @Type(() => Number)
  pesoPorQuintalKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) pesoPfKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) mermaReutilizableKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) mermaDesechableKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) sobranteExportableKg: number;

  @IsInt() @IsOptional() @Type(() => Number) skuId?: number;

  @IsString() @IsOptional() observaciones?: string;
}

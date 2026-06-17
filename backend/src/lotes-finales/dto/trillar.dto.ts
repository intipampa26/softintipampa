import {
  IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrillarDto {
  @IsDateString()
  fecha: string;

  @IsString() @MaxLength(200) planta: string;
  @IsString() @MaxLength(100) malla: string;
  @IsString() @MaxLength(200) tipoSeleccion: string;
  @IsString() @MaxLength(200) encargado: string;
  @IsInt()    @IsOptional() encargadoUsuarioId?: number;

   
  @IsNumber()
  @Min(0.001)
  @Type(() => Number)
  pesoPorQuintalKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) pesoPfKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) mermaReutilizableKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) mermaDesechableKg: number;

   
  @IsNumber() @Min(0) @Type(() => Number) sobranteExportableKg: number;

  @IsString() @IsOptional() observaciones?: string;
}

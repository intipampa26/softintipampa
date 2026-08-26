import {
  IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TrillarDto {
  @IsDateString()
  fecha: string;

  @IsString() @IsNotEmpty({ message: 'La planta es obligatoria para liquidar la trilla' }) @MaxLength(500) planta: string;
  @IsString() @IsNotEmpty({ message: 'La malla es obligatoria para liquidar la trilla' }) @MaxLength(100) malla: string;
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

  @IsString() @IsOptional() @MaxLength(100) nroLiquidacion?: string;

  /** UUID de un grupo de trilla existente al que adjuntar este lote (ver BatchTrillarDto) */
  @IsString() @IsOptional() existingBatchId?: string;

  @IsString() @IsOptional() observaciones?: string;
}

import {
  IsString, IsInt, IsOptional, IsEnum,
  IsNumber, IsDateString, Min, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LoteEstado } from '../lote.entity';

export class CreateLoteDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  codigo?: string;

  /**
   * Por defecto un lote nace en PRE_ADQUISICION (borrador — p.ej. el lote
   * placeholder que se auto-crea al registrar una muestra en campo, antes de
   * confirmar la compra). El formulario "Nuevo lote" del módulo de Lotes ya
   * pide cantidad, planta y fecha de adquisición completas, así que ese
   * puede pasar directamente a PRE_ALISTADO sin pasar por el modal de Acopio.
   */
  @IsEnum(LoteEstado)
  @IsOptional()
  estado?: LoteEstado;

  @IsInt()
  @Min(1)
  tipoProductoId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  campanaId?: number;

  @IsInt()
  @Min(1)
  productorId: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  parcelaId?: number;

  @IsNumber()
  @Min(0.001)
  @Type(() => Number)
  cantidadKg: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  cantidadSacos?: number;

  @IsDateString()
  @IsOptional()
  fechaAdquisicion?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  variedad?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  planta?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  costoTotal?: number;

  @IsString()
  @IsOptional()
  observaciones?: string;
}

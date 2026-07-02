import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LoteEstado } from '../lote.entity';

export class UpdateLoteDto {
  @IsInt() @Min(1) @IsOptional() @Type(() => Number)
  tipoProductoId?: number;

  @IsInt() @Min(1) @IsOptional() @Type(() => Number)
  campanaId?: number;

  @IsInt() @Min(1) @IsOptional() @Type(() => Number)
  productorId?: number;

  @IsInt() @Min(1) @IsOptional() @Type(() => Number)
  parcelaId?: number;

  @IsEnum(LoteEstado)
  @IsOptional()
  estado?: LoteEstado;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  cantidadKg?: number;

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

  @IsString()
  @IsOptional()
  observaciones?: string;
}

import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LoteEstado } from '../lote.entity';

export class UpdateLoteDto {
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

import {
  IsString, IsInt, IsOptional,
  IsNumber, IsDateString, Min, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLoteDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  codigo?: string;

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

  @IsString()
  @IsOptional()
  observaciones?: string;
}

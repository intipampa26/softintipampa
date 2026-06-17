import { IsOptional, IsInt, IsEnum, IsDateString, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMovimientoKardex } from '../movimiento-kardex.entity';

export class FilterKardexDto {
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive() loteFinalId?: number;
  @IsOptional() @IsEnum(TipoMovimientoKardex) tipoMovimiento?: TipoMovimientoKardex;
  @IsOptional() @IsDateString() fechaDesde?: string;
  @IsOptional() @IsDateString() fechaHasta?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
}
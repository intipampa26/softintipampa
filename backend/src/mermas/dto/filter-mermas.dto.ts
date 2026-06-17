import { IsEnum, IsInt, IsOptional, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMerma } from '../merma.entity';

export class FilterMermasDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number = 20;
  @IsOptional() @IsEnum(TipoMerma) tipoMerma?: TipoMerma;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) loteFinalId?: number;
  @IsOptional() @IsDateString() fechaDesde?: string;
  @IsOptional() @IsDateString() fechaHasta?: string;
}

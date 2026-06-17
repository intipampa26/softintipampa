import {
  IsEnum, IsInt, IsNumber, IsPositive, IsDateString,
  IsOptional, IsString, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoMerma } from '../merma.entity';

export class CreateMermaDto {
  @IsInt() @Min(1) loteFinalId: number;

  @IsInt() @Min(1) @IsOptional() trilladoId?: number;

  @IsEnum(TipoMerma) tipoMerma: TipoMerma;

  @IsNumber() @IsPositive() @Type(() => Number) cantidadKg: number;

  @IsInt() @Min(0) @IsOptional() @Type(() => Number) cantidadSacos?: number;

  @IsDateString() fecha: string;

  @IsString() @IsOptional() observaciones?: string;
}

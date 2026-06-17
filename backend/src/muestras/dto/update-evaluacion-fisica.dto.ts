import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEvaluacionFisicaDto {
  @IsNumber() @IsOptional() @Type(() => Number) cafeHumedadPct?: number;
  @IsInt()    @IsOptional() @Type(() => Number) cafeDefectosPrimarios?: number;
  @IsInt()    @IsOptional() @Type(() => Number) cafeDefectosSecundarios?: number;
  @IsString() @IsOptional() cafeGranulometria?: string;
  @IsString() @IsOptional() cafeColorGrano?: string;
  @IsNumber() @IsOptional() @Type(() => Number) cafePesoHectolitrico?: number;
  @IsNumber() @IsOptional() @Type(() => Number) cacaoHumedadPct?: number;
  @IsNumber() @IsOptional() @Type(() => Number) cacaoDefectosPct?: number;
  @IsNumber() @IsOptional() @Type(() => Number) cacaoPurezaPct?: number;
  @IsNumber() @IsOptional() @Type(() => Number) cacaoPesoCienGranos?: number;
  @IsInt()    @IsOptional() @Type(() => Number) cacaoGranosMasa?: number;
  @IsString()    @IsOptional() observaciones?: string;
  @IsInt()       @IsOptional() evaluadorId?: number;
  @IsDateString() @IsOptional() fechaEvaluacion?: string;
}

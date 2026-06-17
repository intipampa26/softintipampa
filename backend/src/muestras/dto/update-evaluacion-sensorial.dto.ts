import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEvaluacionSensorialDto {
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeFraganciaAroma?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeSabor?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafePosgusto?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeAcidez?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeCuerpo?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeBalance?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeUniformidad?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeTazaLimpia?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cafeDulzura?: number;
  @IsNumber() @IsOptional() @Type(() => Number) cafePuntajeTotal?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cacaoFlavor?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cacaoAroma?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cacaoAcidez?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cacaoAmargor?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cacaoAstringencia?: number;
  @IsNumber() @IsOptional() @Min(0) @Max(10) @Type(() => Number) cacaoPersistencia?: number;
  @IsNumber() @IsOptional() @Type(() => Number) cacaoPuntajeTotal?: number;
  @IsInt()    @IsOptional() @Min(0) @Type(() => Number) defectos?: number;
  @IsString() @IsOptional() observaciones?: string;
  @IsInt()    @IsOptional() evaluadorId?: number;
  @IsDateString() @IsOptional() fechaEvaluacion?: string;
}

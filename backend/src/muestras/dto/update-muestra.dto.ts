import { IsBoolean, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoMuestra } from '../muestra.entity';

export class UpdateMuestraDto {
  @IsInt() @Min(1) @IsOptional() productorId?: number;
  @IsInt() @Min(1) @IsOptional() campanaId?: number;
  @IsInt() @Min(1) @IsOptional() loteFinalId?: number;
  @IsInt() @Min(1) @IsOptional() loteId?: number;
  @IsInt() @Min(1) @IsOptional() parcelaId?: number;
  @IsNumber() @Min(0) @IsOptional() @Type(() => Number) cantidadKg?: number;
  @IsDateString() @IsOptional() fechaRegistro?: string;
  @IsString() @IsOptional() @MaxLength(100) tipoMuestra?: string;
  @IsNumber() @Min(0) @IsOptional() @Type(() => Number) rendimiento?: number;
  @IsNumber() @Min(0) @Max(100) @IsOptional() @Type(() => Number) humedad?: number;
  @IsString() @IsOptional() @MaxLength(200) base?: string;
  @IsEnum(EstadoMuestra) @IsOptional() estado?: EstadoMuestra;
  @IsString() @IsOptional() @MaxLength(200) variedad?: string;
  @IsString() @IsOptional() @MaxLength(200) proceso?: string;
  @IsString() @IsOptional() @MaxLength(200) categoriaMuestra?: string;
  @IsDateString() @IsOptional() fechaCata?: string;
  @IsInt() @IsOptional() @Type(() => Number) añoCosecha?: number;
  @IsString() @IsOptional() @MaxLength(100) pais?: string;
  @IsString() @IsOptional() @MaxLength(200) region?: string;
  @IsString() @IsOptional() observaciones?: string;
  @IsBoolean() @IsOptional() activo?: boolean;
}

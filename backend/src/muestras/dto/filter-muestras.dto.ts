import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EstadoMuestra, ResultadoMuestra, TipoMuestraProducto } from '../muestra.entity';

export class FilterMuestrasDto extends PaginationDto {
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) campanaId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) productorId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) loteFinalId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) loteId?: number;
  @IsEnum(TipoMuestraProducto) @IsOptional() tipoMuestra?: TipoMuestraProducto;
  @IsEnum(EstadoMuestra)       @IsOptional() estado?: EstadoMuestra;
  @IsEnum(ResultadoMuestra)    @IsOptional() resultado?: ResultadoMuestra;
  @IsString()  @IsOptional() search?: string;
  @IsString()  @IsOptional() variedad?: string;
  @IsBoolean() @IsOptional() @Transform(({ value }) => value === 'true' || value === true) sinLote?: boolean;
}

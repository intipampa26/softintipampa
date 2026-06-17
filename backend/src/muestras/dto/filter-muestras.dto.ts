import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EstadoMuestra } from '../muestra.entity';

export class FilterMuestrasDto extends PaginationDto {
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) campanaId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) productorId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) loteFinalId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) loteId?: number;
  @IsString() @IsOptional() tipoMuestra?: string;
  @IsEnum(EstadoMuestra) @IsOptional() estado?: EstadoMuestra;
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() variedad?: string;
}

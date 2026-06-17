import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LoteEstado } from '../lote.entity';

export class FilterLotesDto extends PaginationDto {
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) tipoProductoId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) campanaId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) productorId?: number;
  @IsEnum(LoteEstado) @IsOptional() estado?: LoteEstado;
  @IsString() @IsOptional() search?: string;
  @IsString() @IsOptional() variedad?: string;
  @IsString() @IsOptional() planta?: string;
}

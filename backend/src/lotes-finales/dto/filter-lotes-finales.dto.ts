import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { LoteFinalEstado } from '../lote-final.entity';

export class FilterLotesFinalesDto extends PaginationDto {
  @IsEnum(LoteFinalEstado) @IsOptional() estado?: LoteFinalEstado;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) tipoProductoId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) campanaId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) loteOrigenId?: number;
  @IsInt() @Min(1) @IsOptional() @Type(() => Number) productorId?: number;
}

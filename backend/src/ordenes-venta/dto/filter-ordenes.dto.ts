import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { EtapaOrden } from '../orden-venta.entity';

export class FilterOrdenesDto extends PaginationDto {
  @IsOptional() @IsString()
  search?: string;

  @IsOptional() @IsEnum(EtapaOrden)
  etapaActual?: EtapaOrden;

  @IsOptional() @IsString()
  campana?: string;

  @IsOptional() @IsString()
  productor?: string;

  @IsOptional() @IsString()
  lote?: string;
}

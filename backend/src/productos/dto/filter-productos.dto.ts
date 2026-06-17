import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ProductoCategoria } from '../producto.entity';

export class FilterProductosDto extends PaginationDto {
  @IsEnum(ProductoCategoria)
  @IsOptional()
  categoria?: ProductoCategoria;

  @IsString()
  @IsOptional()
  search?: string;
}

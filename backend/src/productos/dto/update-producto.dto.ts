import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductoUnidad, ProductoCategoria } from '../producto.entity';

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(ProductoUnidad)
  @IsOptional()
  unidad?: ProductoUnidad;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  precioBase?: number;

  @IsEnum(ProductoCategoria)
  @IsOptional()
  categoria?: ProductoCategoria;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

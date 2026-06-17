import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EtapaOrden } from '../orden-venta.entity';

export class CreateOrdenVentaDto {
  @IsString() @IsNotEmpty()
  cliente: string;

  @IsString() @IsNotEmpty()
  productor: string;

  @IsOptional() @IsString()
  campana?: string;

  @IsOptional() @IsString()
  lote?: string;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  cantidadKg?: number;

  @IsOptional() @IsString()
  destino?: string;

  @IsOptional() @IsString()
  tipoProducto?: string;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0)
  montoUSD?: number;

  @IsOptional() @IsDateString()
  fecha?: string;

  @IsOptional() @IsEnum(EtapaOrden)
  etapaActual?: EtapaOrden;
}

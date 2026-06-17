import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { EtapaOrden, EstadoEtapa } from '../orden-venta.entity';

export class UpdateEtapaDto {
  @IsEnum(EtapaOrden)
  etapa: EtapaOrden;

  @IsEnum(EstadoEtapa)
  estado: EstadoEtapa;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(100)
  porcentaje?: number;

  @IsOptional() @IsString()
  fecha?: string;
}

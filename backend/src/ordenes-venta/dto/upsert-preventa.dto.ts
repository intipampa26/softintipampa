import { IsDateString, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MuestraEnvioItemDto {
  @IsNumber() muestraId: number;
  @IsOptional() @IsNumber() cantidad?: number | null;
  @IsOptional() @IsNumber() costos?: number | null;
}

export class UpsertPreventaDto {
  @IsOptional() @IsDateString() fechaEnvio?: string;
  @IsOptional() @IsDateString() fechaRecepcion?: string;
  @IsOptional() @IsString()    rucDni?: string;
  @IsOptional() @IsString()    clienteNombre?: string;
  @IsOptional() @IsString()    courier?: string;
  @IsOptional() @IsNumber()    costoCourier?: number;
  @IsOptional() @IsString()    fitosanitario?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => MuestraEnvioItemDto)
  muestrasDetalle?: MuestraEnvioItemDto[];
}

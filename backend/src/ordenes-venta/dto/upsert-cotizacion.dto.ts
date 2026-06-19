import { IsDateString, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertCotizacionDto {
  @IsOptional() @IsString()    nroCotizacion?: string;
  @IsOptional() @IsDateString() fechaCotizacion?: string;
  @IsOptional() @IsNumber()    precioUsd?: number;
  @IsOptional() @IsString() @IsIn(['USD', 'PEN']) moneda?: string;
  @IsOptional() @IsNumber()    pesoKg?: number;
  @IsOptional() @IsString()    incoterm?: string;
  @IsOptional() @IsString()    puerto?: string;
  @IsOptional() @IsString()    condicionesPago?: string;
  @IsOptional() @IsNumber()    validezDias?: number;
  @IsOptional() @IsString()    observaciones?: string;
}

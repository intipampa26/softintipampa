import { IsIn, IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class UpsertAlistadoDto {
  @IsOptional() @IsString()  nroContrato?: string;
  @IsOptional() @IsDateString() fechaContrato?: string;
  @IsOptional() @IsString()  comprador?: string;
  @IsOptional() @IsNumber()  precioUsd?: number;
  @IsOptional() @IsString() @IsIn(['USD', 'PEN']) moneda?: string;
  @IsOptional() @IsNumber()  cantidadKgCompromiso?: number;
  @IsOptional() @IsString()  incoterm?: string;
  @IsOptional() @IsString()  condPago?: string;
  @IsOptional() @IsDateString() fechaEntrega?: string;
  @IsOptional() @IsString()  notasCompromiso?: string;

  @IsOptional() @IsString()  planta?: string;
  @IsOptional() @IsDateString() fechaAlistado?: string;
  @IsOptional() @IsString()  guiaRemision?: string;
  @IsOptional() @IsDateString() fechaTraslado?: string;
  @IsOptional() @IsString()  tipoEmpaque?: string;
  @IsOptional() @IsString()  transporte?: string;
  @IsOptional() @IsNumber()  costoPlanta?: number;
  @IsOptional() @IsNumber()  costoEstiba?: number;
  @IsOptional() @IsNumber()  costoEmpaque?: number;
  @IsOptional() @IsNumber()  costoTransporte?: number;
  @IsOptional() @IsBoolean() separarAlistado?: boolean;
  @IsOptional() @IsBoolean() planAlistado?: boolean;
  @IsOptional() @IsBoolean() costViaticos?: boolean;
  @IsOptional() lotesAsignados?: { loteFinalId: number; codigo?: string; cantidadKg?: number | null; nroSacos?: number | null; fechaProceso?: string | null }[];
}

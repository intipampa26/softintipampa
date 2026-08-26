import { IsIn, IsOptional, IsString, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

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
  // Sin @Type(), el diseño de TS solo reporta "Array" (sin info del
  // elemento) — con transform+enableImplicitConversion del ValidationPipe
  // global, class-transformer intentaba "convertir" ese Array genérico y
  // terminaba envolviendo/vaciando el contenido real (guardaba [[]] en vez
  // del array de lotes). @Transform pass-through evita esa conversión.
  // Con enableImplicitConversion del ValidationPipe global, class-transformer
  // "convierte" este Array genérico (sin @Type(), TS solo reporta "Array" en
  // el metadata) ANTES de aplicar @Transform — terminaba llegando ya vacío
  // como params.value ([[]]). Se lee directo de params.obj (el objeto plano
  // original, sin tocar) para evitar esa conversión implícita corrupta.
  @IsOptional()
  @Transform(({ obj, key }) => obj[key])
  lotesAsignados?: { loteFinalId: number; codigo?: string; cantidadKg?: number | null; nroSacos?: number | null; fechaProceso?: string | null }[];
}

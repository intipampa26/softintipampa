import { IsOptional, IsString, IsNumber, IsDateString, IsInt } from 'class-validator';

export class UpsertPostVentaDto {
  @IsOptional() @IsString()  nroFactura?: string;
  @IsOptional() @IsDateString() fechaFactura?: string;
  @IsOptional() @IsNumber()  montoFinal?: number;
  @IsOptional() @IsString()  moneda?: string;
  @IsOptional() @IsDateString() fechaPago?: string;
  @IsOptional() @IsString()  estadoPago?: string;
  @IsOptional() @IsString()  banco?: string;
  @IsOptional() @IsString()  nroCuenta?: string;
  @IsOptional() @IsString()  observCierre?: string;

  @IsOptional() @IsDateString() fechaFeedback?: string;
  @IsOptional() @IsInt()     rating?: number;
  @IsOptional() @IsString()  comentCalidad?: string;
  @IsOptional() @IsString()  comentServicio?: string;
  @IsOptional() @IsString()  recomendaria?: string;
  @IsOptional() @IsString()  observFeedback?: string;

  @IsOptional() @IsString()  nroReclamo?: string;
  @IsOptional() @IsDateString() fechaReclamo?: string;
  @IsOptional() @IsString()  tipoReclamo?: string;
  @IsOptional() @IsString()  descripcionReclamo?: string;
  @IsOptional() @IsString()  estadoReclamo?: string;
  @IsOptional() @IsString()  solucion?: string;
  @IsOptional() @IsDateString() fechaResolucion?: string;
  @IsOptional() @IsString()  responsable?: string;
  @IsOptional() @IsString()  observReclamo?: string;
}

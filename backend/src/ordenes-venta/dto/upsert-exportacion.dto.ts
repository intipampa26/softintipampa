import { IsOptional, IsString, IsNumber, IsDateString, IsBoolean, IsInt, IsObject } from 'class-validator';

export class UpsertExportacionDto {
  @IsOptional() @IsString()  codExport?: string;
  @IsOptional() @IsDateString() fechaExport?: string;
  @IsOptional() @IsString()  tipoProducto?: string;
  @IsOptional() @IsNumber()  cantExport?: number;
  @IsOptional() @IsString()  estadoAvance?: string;

  @IsOptional() @IsString()  nroDua?: string;
  @IsOptional() @IsDateString() fechaDespacho?: string;
  @IsOptional() @IsString()  agente?: string;
  @IsOptional() @IsString()  naviera?: string;
  @IsOptional() @IsString()  almacen?: string;
  @IsOptional() @IsString()  avisoSalida?: string;
  @IsOptional() @IsString()  nroBl?: string;
  @IsOptional() @IsDateString() fechaSalidaNave?: string;
  @IsOptional() @IsInt()     cantidadPallets?: number;
  @IsOptional() @IsInt()     cantidadSacos?: number;
  @IsOptional() @IsNumber()  pesoTotal?: number;
  @IsOptional() @IsString()  evidenciasDespacho?: string;
  @IsOptional() @IsNumber()  costoFob?: number;
  @IsOptional() @IsNumber()  comisionAgente?: number;
  @IsOptional() @IsNumber()  transporteAlmacen?: number;
  @IsOptional() @IsNumber()  costoCertificados?: number;
  @IsOptional() @IsString()  puertoEmbarque?: string;
  @IsOptional() @IsString()  puertoDestino?: string;
  @IsOptional() @IsDateString() fechaEmbarque?: string;
  @IsOptional() @IsString()  contenedor?: string;
  @IsOptional() @IsString()  nroPrecinto?: string;
  @IsOptional() @IsString()  kardexNro?: string;
  @IsOptional() @IsBoolean() kardexRegistrado?: boolean;
  @IsOptional() @IsString()  observAduanero?: string;

  @IsOptional() @IsDateString() fechaEnvioDocs?: string;
  @IsOptional() @IsString()  metodoEnvio?: string;
  @IsOptional() @IsString()  contactoCliente?: string;
  @IsOptional() @IsObject()  documentos?: Record<string, boolean>;
  @IsOptional() @IsObject()  certificaciones?: Record<string, boolean>;
  @IsOptional() @IsString()  observDatos?: string;

  @IsOptional() @IsString()  destinoPlan?: string;
  @IsOptional() @IsObject()  documentosAsociados?: string[];
  @IsOptional() @IsObject()  reportesCalidad?: string[];
  @IsOptional() @IsObject()  documentacionExportacion?: Record<string, unknown>;
  @IsOptional() @IsString()  campanaPlan?: string;
  @IsOptional() @IsString()  lotesAsociados?: string;
  @IsOptional() @IsDateString() fechaCorte?: string;
  @IsOptional() @IsDateString() fechaZarpe?: string;
  @IsOptional() @IsDateString() fechaEta?: string;
  @IsOptional() @IsString()  navieraPlan?: string;
  @IsOptional() @IsString()  puertoOrigenPlan?: string;
  @IsOptional() @IsString()  puertoDestinoPlan?: string;
  @IsOptional() @IsString()  tipoCont?: string;
  @IsOptional() @IsInt()     cantCont?: number;
  @IsOptional() @IsNumber()  pesoNeto?: number;
  @IsOptional() @IsNumber()  pesoBruto?: number;
  @IsOptional() @IsString()  observPlan?: string;

  @IsOptional() @IsString()  nroFactura?: string;
  @IsOptional() @IsDateString() fechaFactura?: string;
  @IsOptional() @IsNumber()  montoFinal?: number;
  @IsOptional() @IsString()  monedaCierre?: string;
  @IsOptional() @IsDateString() fechaPagoCierre?: string;
  @IsOptional() @IsString()  estadoPago?: string;
  @IsOptional() @IsString()  banco?: string;
  @IsOptional() @IsString()  nroCuenta?: string;
  @IsOptional() @IsString()  observCierre?: string;

  // ── Plan de Exportación ───────────────────────────────────────────────────────
  @IsOptional() @IsDateString() fechaCutoff?: string;
  @IsOptional() @IsDateString() fechaFitosanitario?: string;
  @IsOptional() @IsDateString() fechaEntregaCarga?: string;
  @IsOptional() @IsString()  agenteAduanasPlan?: string;
  @IsOptional() @IsString()  agenteCarga?: string;
  @IsOptional() @IsNumber()  valorProductos?: number;
  @IsOptional() @IsNumber()  pesoTotalPlan?: number;
  @IsOptional() @IsString()  puertoExportacion?: string;
  @IsOptional() @IsBoolean() fullContainer?: boolean;
  @IsOptional() @IsInt()     cantidadPaletasPlan?: number;
  @IsOptional() @IsBoolean() deshumedecedores?: boolean;
  @IsOptional() @IsBoolean() controlTemperatura?: boolean;
  @IsOptional() @IsString()  numBooking?: string;

  // ── Despacho Aduanero ─────────────────────────────────────────────────────────
  @IsOptional() @IsDateString() fechaIngresoCarga?: string;
  @IsOptional() @IsDateString() fechaSenasa?: string;
  @IsOptional() @IsInt()     cantidadPalletsDesp?: number;
  @IsOptional() @IsInt()     cantidadPaquetes?: number;

  // ── Cierre de Exportación ─────────────────────────────────────────────────────
  @IsOptional() @IsNumber()  costoTransporteAlmacen?: number;
  @IsOptional() @IsNumber()  costoComisionAgente?: number;
  @IsOptional() @IsNumber()  costoAlmacenPortuario?: number;
  @IsOptional() @IsNumber()  costoFlete?: number;
  @IsOptional() @IsNumber()  costoSeguro?: number;
  @IsOptional() @IsNumber()  pesoTotalCierre?: number;
  @IsOptional() @IsString()  nroCertFito?: string;
  @IsOptional() @IsString()  nroCertOrigen?: string;
  @IsOptional() @IsString()  guiaRemisionCierre?: string;
  @IsOptional() @IsString()  facturaSupanat?: string;

  // ── Files + Lotes ─────────────────────────────────────────────────────────────
  @IsOptional() @IsObject()  filesMap?: Record<string, unknown[]>;
  @IsOptional() @IsObject()  lotesConPrecio?: unknown[];
}

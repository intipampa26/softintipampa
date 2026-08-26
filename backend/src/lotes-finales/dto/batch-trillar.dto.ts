import {
  IsArray, IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LoteOverrideDto {
  @IsInt() @Type(() => Number) id: number;
  @IsOptional() @IsInt() @Type(() => Number) skuId?: number;
  /**
   * Por lote solo se conoce peso pergamino (entrada) y peso oro (salida) — la
   * merma total de ese lote sale de la resta. El TIPO de merma (Segunda vs.
   * Descarte) no es atribuible a un lote individual dentro de un batch: se
   * clasifica recién al mezclar toda la liquidación, así que ese detalle
   * sigue siendo solo agregado (mermaReutilizableKg/mermaDesechableKg a
   * nivel de BatchTrillarDto), nunca por lote.
   */
  @IsOptional() @IsNumber() @Min(0) @Type(() => Number) pesoPfKg?: number;
}

export class BatchTrillarDto {
  /** IDs de los LoteFinal a trillar en esta operación grupal */
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  ids: number[];

  @IsDateString()
  fecha: string;

  @IsString() @IsOptional() @MaxLength(500) planta?: string;
  @IsString() @IsOptional() @MaxLength(100) malla?: string;
  @IsString() @IsOptional() @MaxLength(500) tipoSeleccion?: string;
  @IsString() @IsOptional() @MaxLength(500) encargado?: string;

  /** Peso por quintal (kg) — se aplica igual a todos los lotes del batch */
  @IsNumber() @Min(0.001) @Type(() => Number)
  pesoPorQuintalKg: number;

  /** Merma reutilizable TOTAL de la operación (se distribuye por prorrateo) */
  @IsNumber() @Min(0) @Type(() => Number)
  mermaReutilizableKg: number;

  /** Merma desechable TOTAL de la operación (se distribuye por prorrateo) */
  @IsNumber() @Min(0) @Type(() => Number)
  mermaDesechableKg: number;

  /** Sobrante exportable TOTAL de la operación (se distribuye por prorrateo) */
  @IsNumber() @Min(0) @Type(() => Number)
  sobranteExportableKg: number;

  @IsInt() @IsOptional() @Type(() => Number) skuId?: number;

  @IsString() @IsOptional() @MaxLength(100) nroLiquidacion?: string;

  /**
   * UUID de un grupo de trilla ya existente.
   * Si se provee, los nuevos lotes se incorporan a ese grupo
   * (comparten origenBatchId y nroLiquidacion del grupo original).
   */
  @IsString() @IsOptional() existingBatchId?: string;

  @IsString() @IsOptional() observaciones?: string;

  /**
   * Overrides por lote: cuando se envía, el lote usa su propio SKU y mermas
   * en lugar de la distribución por prorrateo.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LoteOverrideDto)
  loteOverrides?: LoteOverrideDto[];
}

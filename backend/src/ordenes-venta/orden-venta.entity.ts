import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

export enum EtapaOrden {
  PREVENTA    = 'preventa',
  ALISTADO    = 'alistado',
  EXPORTACION = 'exportacion',
  POST_VENTA  = 'post_venta',
}

export enum EstadoEtapa {
  PENDIENTE   = 'pendiente',
  EN_PROCESO  = 'en_proceso',
  COMPLETADO  = 'completado',
}

export interface EtapaEstado {
  estado:     EstadoEtapa;
  porcentaje: number;
  fecha:      string | null;
}

export type EtapasEstado = Record<EtapaOrden, EtapaEstado>;

function defaultEtapas(): EtapasEstado {
  return {
    [EtapaOrden.PREVENTA]:    { estado: EstadoEtapa.EN_PROCESO, porcentaje: 0,  fecha: null },
    [EtapaOrden.ALISTADO]:    { estado: EstadoEtapa.PENDIENTE,  porcentaje: 0,  fecha: null },
    [EtapaOrden.EXPORTACION]: { estado: EstadoEtapa.PENDIENTE,  porcentaje: 0,  fecha: null },
    [EtapaOrden.POST_VENTA]:  { estado: EstadoEtapa.PENDIENTE,  porcentaje: 0,  fecha: null },
  };
}

@Entity('ordenes_venta')
export class OrdenVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 30, unique: true })
  codigo: string;

  @Column({ length: 200 })
  cliente: string;

  @Column({ length: 200 })
  productor: string;

  @Column({ length: 100, nullable: true })
  campana: string | null;

  @Column({ length: 100, nullable: true })
  lote: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, default: 0 })
  cantidadKg: number;

  @Column({ length: 100, nullable: true })
  destino: string | null;

  @Column({ length: 100, nullable: true })
  tipoProducto: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, default: 0 })
  montoUSD: number;

  @Column({ type: 'date', nullable: true })
  fecha: string | null;

  @Index()
  @Column({ type: 'enum', enum: EtapaOrden, default: EtapaOrden.PREVENTA })
  etapaActual: EtapaOrden;

  @Column({ type: 'jsonb', default: () => `'${JSON.stringify(defaultEtapas())}'` })
  etapas: EtapasEstado;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

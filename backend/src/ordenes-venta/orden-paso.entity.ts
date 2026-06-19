import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

export enum EstadoPaso {
  PENDIENTE  = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADO = 'completado',
}

export const PASOS_LABELS = [
  'Registrado',
  'Documentos preparados',
  'Recepcionado en almacén',
  'Control de calidad',
  'Consolidado en contenedor',
  'Aforo / Aduana',
  'Embarque',
  'En tránsito',
  'Entregado y liquidado',
];

@Entity('orden_pasos')
@Index('uq_orden_paso_indice', ['ordenVentaId', 'indice'], { unique: true })
export class OrdenPaso {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  ordenVentaId: number;

  @ManyToOne(() => OrdenVenta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenVentaId' })
  ordenVenta: OrdenVenta;

  @Column({ type: 'smallint' })
  indice: number;

  @Column({ length: 100 })
  label: string;

  @Column({ type: 'date', nullable: true })
  fecha: string | null;

  @Column({ length: 100, nullable: true })
  usuario: string | null;

  @Column({ type: 'enum', enum: EstadoPaso, default: EstadoPaso.PENDIENTE })
  estado: EstadoPaso;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

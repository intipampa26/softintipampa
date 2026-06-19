import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

@Entity('orden_alistado')
export class OrdenAlistado {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  ordenVentaId: number;

  @ManyToOne(() => OrdenVenta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenVentaId' })
  ordenVenta: OrdenVenta;

  @Column({ length: 100, nullable: true })
  nroContrato: string | null;

  @Column({ type: 'date', nullable: true })
  fechaContrato: string | null;

  @Column({ length: 200, nullable: true })
  comprador: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  precioUsd: number | null;

  @Column({ length: 3, nullable: true, default: 'USD' })
  moneda: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cantidadKgCompromiso: number | null;

  @Column({ length: 10, nullable: true })
  incoterm: string | null;

  @Column({ length: 100, nullable: true })
  condPago: string | null;

  @Column({ type: 'date', nullable: true })
  fechaEntrega: string | null;

  @Column({ type: 'text', nullable: true })
  notasCompromiso: string | null;

  @Column({ length: 200, nullable: true })
  planta: string | null;

  @Column({ type: 'date', nullable: true })
  fechaAlistado: string | null;

  @Column({ length: 100, nullable: true })
  guiaRemision: string | null;

  @Column({ type: 'date', nullable: true })
  fechaTraslado: string | null;

  @Column({ length: 200, nullable: true })
  tipoEmpaque: string | null;

  @Column({ length: 200, nullable: true })
  transporte: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoPlanta: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoEstiba: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoEmpaque: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoTransporte: number | null;

  @Column({ default: false })
  separarAlistado: boolean;

  @Column({ default: false })
  planAlistado: boolean;

  @Column({ default: false })
  costViaticos: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

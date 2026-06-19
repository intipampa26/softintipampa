import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

@Entity('orden_cotizaciones')
export class OrdenCotizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  ordenVentaId: number;

  @ManyToOne(() => OrdenVenta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenVentaId' })
  ordenVenta: OrdenVenta;

  @Column({ length: 50, nullable: true })
  nroCotizacion: string | null;

  @Column({ type: 'date', nullable: true })
  fechaCotizacion: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  precioUsd: number | null;

  @Column({ length: 3, nullable: true, default: 'USD' })
  moneda: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, nullable: true })
  pesoKg: number | null;

  @Column({ length: 10, nullable: true })
  incoterm: string | null;

  @Column({ length: 150, nullable: true })
  puerto: string | null;

  @Column({ length: 100, nullable: true })
  condicionesPago: string | null;

  @Column({ nullable: true })
  validezDias: number | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

@Entity('orden_post_venta')
export class OrdenPostVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  ordenVentaId: number;

  @ManyToOne(() => OrdenVenta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenVentaId' })
  ordenVenta: OrdenVenta;

  @Column({ length: 100, nullable: true })
  nroFactura: string | null;

  @Column({ type: 'date', nullable: true })
  fechaFactura: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  montoFinal: number | null;

  @Column({ length: 5, default: 'USD' })
  moneda: string;

  @Column({ type: 'date', nullable: true })
  fechaPago: string | null;

  @Column({ length: 50, nullable: true })
  estadoPago: string | null;

  @Column({ length: 100, nullable: true })
  banco: string | null;

  @Column({ length: 200, nullable: true })
  nroCuenta: string | null;

  @Column({ type: 'text', nullable: true })
  observCierre: string | null;

  @Column({ type: 'date', nullable: true })
  fechaFeedback: string | null;

  @Column({ type: 'smallint', nullable: true })
  rating: number | null;

  @Column({ type: 'text', nullable: true })
  comentCalidad: string | null;

  @Column({ type: 'text', nullable: true })
  comentServicio: string | null;

  @Column({ length: 5, nullable: true })
  recomendaria: string | null;

  @Column({ type: 'text', nullable: true })
  observFeedback: string | null;

  @Column({ length: 100, nullable: true })
  nroReclamo: string | null;

  @Column({ type: 'date', nullable: true })
  fechaReclamo: string | null;

  @Column({ length: 100, nullable: true })
  tipoReclamo: string | null;

  @Column({ type: 'text', nullable: true })
  descripcionReclamo: string | null;

  @Column({ length: 50, nullable: true })
  estadoReclamo: string | null;

  @Column({ type: 'text', nullable: true })
  solucion: string | null;

  @Column({ type: 'date', nullable: true })
  fechaResolucion: string | null;

  @Column({ length: 200, nullable: true })
  responsable: string | null;

  @Column({ type: 'text', nullable: true })
  observReclamo: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

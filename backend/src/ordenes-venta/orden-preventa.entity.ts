import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

export interface MuestraEnvioItem {
  muestraId:  number;
  cantidad:   number | null;
  costos:     number | null;
  comentario: string | null;
}

@Entity('orden_preventa')
export class OrdenPreventa {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  ordenVentaId: number;

  @ManyToOne(() => OrdenVenta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenVentaId' })
  ordenVenta: OrdenVenta;

  @Column({ type: 'date', nullable: true })
  fechaEnvio: string | null;

  @Column({ type: 'date', nullable: true })
  fechaRecepcion: string | null;

  @Column({ length: 30, nullable: true })
  rucDni: string | null;

  @Column({ length: 200, nullable: true })
  clienteNombre: string | null;

  @Column({ length: 100, nullable: true })
  courier: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costoCourier: number | null;

  @Column({ length: 5, nullable: true })
  fitosanitario: string | null;

  @Column({ type: 'jsonb', nullable: true })
  muestrasDetalle: MuestraEnvioItem[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { LoteFinal } from '../lotes-finales/lote-final.entity';
import { Trillado } from '../trillado/trillado.entity';

export enum TipoMerma {
  REUTILIZABLE = 'REUTILIZABLE', 
  DESECHABLE   = 'DESECHABLE',   
  EXPORTABLE   = 'EXPORTABLE',   
}

export const TIPO_MERMA_PREFIX: Record<TipoMerma, string> = {
  [TipoMerma.REUTILIZABLE]: 'LR',
  [TipoMerma.DESECHABLE]:   'LD',
  [TipoMerma.EXPORTABLE]:   'LE',
};

@Entity('mermas')
export class Merma {
  @PrimaryGeneratedColumn()
  id: number;

   
  @Column({ length: 50, unique: true })
  codigo: string;

  @Index()
  @Column()
  loteFinalId: number;

  @ManyToOne(() => LoteFinal, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loteFinalId' })
  loteFinal: LoteFinal;

  @Index()
  @Column({ nullable: true })
  trilladoId: number | null;

  @ManyToOne(() => Trillado, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'trilladoId' })
  trillado: Trillado;

  @Column({ type: 'enum', enum: TipoMerma })
  tipoMerma: TipoMerma;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidadKg: number;

  @Column({ nullable: true })
  cantidadSacos: number | null;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

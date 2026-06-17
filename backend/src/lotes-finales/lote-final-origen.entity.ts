import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LoteFinal } from './lote-final.entity';
import { Lote } from '../lotes/lote.entity';

 
@Entity('lote_final_origenes')
export class LoteFinalOrigen {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  loteFinalId: number;

  @ManyToOne(() => LoteFinal, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loteFinalId' })
  loteFinal: LoteFinal;

  @Index()
  @Column()
  loteOrigenId: number;

  @ManyToOne(() => Lote, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loteOrigenId' })
  loteOrigen: Lote;

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidadAportadaKg: number;

  @CreateDateColumn()
  createdAt: Date;
}

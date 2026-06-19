import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LoteFinal } from '../lotes-finales/lote-final.entity';
import { User } from '../users/user.entity';

export enum TipoMovimientoKardex {
  INGRESO = 'INGRESO',  
  SALIDA  = 'SALIDA',   
  MERMA   = 'MERMA',    
  AJUSTE  = 'AJUSTE',   
}

export enum ReferenciaTipoKardex {
  TRILLADO          = 'TRILLADO',
  VENTA             = 'VENTA',
  AJUSTE            = 'AJUSTE',
  MUESTRA           = 'MUESTRA',
  PREVENTA_MUESTRA  = 'PREVENTA_MUESTRA',
}

 
@Entity('movimientos_cadex')
export class MovimientoKardex {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  loteFinalId: number;

  @ManyToOne(() => LoteFinal, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loteFinalId' })
  loteFinal: LoteFinal;

  @Column({ type: 'enum', enum: TipoMovimientoKardex })
  tipoMovimiento: TipoMovimientoKardex;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidadKg: number;

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  saldoKg: number;

  @Column({ type: 'enum', enum: ReferenciaTipoKardex })
  referenciaTipo: ReferenciaTipoKardex;

   
  @Column({ nullable: true })
  referenciaId: number | null;

  @Column({ type: 'date' })
  fecha: string;

   
  @Column({ type: 'timestamptz', nullable: true, default: () => 'NOW()' })
  horaEntrada: Date | null;

   
  @Column({ type: 'timestamptz', nullable: true })
  horaSalida: Date | null;

  @Index()
  @Column({ nullable: true })
  usuarioId: number | null;

  @ManyToOne(() => User, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
